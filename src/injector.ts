import * as babel from '@babel/core';
import * as babelTypes from '@babel/types';
import * as t from './types/index';
import * as generator from './generator';
import { v4 as uuid } from 'uuid';

/**
 * Injects the PropTypes from parsing each typescript file into a corresponding JavaScript file.
 * @param propTypes Result from `parse` to inject into the JavaScript code
 */
export function inject(inputFilePath: string, propTypes: t.ProgramNode): string | null {
	if (propTypes.body.length === 0) {
		return null;
	}

	const propTypesToInject = new Map<string, string>();

	// Since the JS proptypes are being generated from scratch, the source to the babel transform
	// is empty.
	const sourceContent = '';

	const result = babel.transformSync(sourceContent, {
		plugins: [
			require.resolve('@babel/plugin-syntax-class-properties'),
			[require.resolve('@babel/plugin-transform-typescript'), { allExtensions: true, isTSX: true }],
			plugin(propTypes, propTypesToInject, inputFilePath)
		],
		presets: ['@babel/preset-react'],
		configFile: false,
		babelrc: false,
		retainLines: true
	});

	let code = result && result.code;
	if (!code) {
		return null;
	}

	// Inject new lines between statements
	propTypesToInject.forEach((value, key) => {
		code = code!.replace(key, `\n\n${value}\n\n`);
	});

	return code;
}

function addSpacedStatement(mapOfPropTypes: Map<string, string>, source: string) {
	// Hack to inject new lines between statements
	const placeholder = `const a${uuid().replace(/\-/g, '_')} = null;`;
	mapOfPropTypes.set(placeholder, source);
	return babel.template.statement.ast(placeholder);
}

function plugin(
	propTypes: t.ProgramNode,
	mapOfPropTypes: Map<string, string>,
	inputFilePath: string
): babel.PluginObj {
	return {
		visitor: {
			Program: {
				enter(path) {
					path.addComment(
						'leading',
						`\nAUTO-GENERATED EDIT AT YOUR OWN PERIL:\nThese propTypes were auto-generated from the TypeScript definitions in: ${inputFilePath}\n`
					);
					path.node.body = [
						addSpacedStatement(mapOfPropTypes, "import PropTypes from 'prop-types'")
					];
					propTypes.body.forEach(props => {
						const source = generator.generate(props);
						path.pushContainer('body', addSpacedStatement(mapOfPropTypes, source));
					});
				}
			}
		}
	};
}
