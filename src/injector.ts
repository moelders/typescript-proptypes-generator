import * as babel from '@babel/core';
import * as babelTypes from '@babel/types';
import * as t from './types/index';
import * as generator from './generator';
import { v4 as uuid } from 'uuid';

/**
 * Injects the PropTypes from parsing each typescript file into a corresponding JavaScript file.
 * @param propTypes Result from `parse` to inject into the JavaScript code
 */
export function inject(
	propTypes: t.ProgramNode,
): string | null {
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
			[require.resolve("@babel/plugin-transform-typescript"), { allExtensions: true, isTSX: true }],
			plugin(propTypes, propTypesToInject),
		],
		presets: ["@babel/preset-react"],
		configFile: false,
		babelrc: false,
		retainLines: true,
	});

	let code = result && result.code;
	if (!code) {
		return null;
	}

	// Replace the placeholders with the generated prop-types
	// Workaround for issues with comments getting removed and malformed
	propTypesToInject.forEach((value, key) => {
		code = code!.replace(key, `\n\n${value}\n\n`);
	});

	return code;
}

function plugin(
	propTypes: t.ProgramNode,
	mapOfPropTypes: Map<string, string>
): babel.PluginObj {
	return {
		visitor: {
			Program: {
				enter(path) {
					path.node.body = [];
                    propTypes.body.forEach(props => {
                      var source = generator.generate(props);
                      var placeholder = "const a" + uuid().replace(/\-/g, '_') + " = null;";
                      mapOfPropTypes.set(placeholder, source);
                      path.node.body = path.node.body.concat([babel.template.statement.ast(placeholder)])
                    })
                    path.node.body = [babel.template.statement.ast("import PropTypes from 'prop-types'")].concat(path.node.body);
				},
			},
		},
	};
}
