import fse from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import * as injector from './injector';
import * as loader from './loader';
import * as parser from './parser';
import * as prettier from 'prettier';
import globCallback from 'glob';
import { promisify } from 'util';
import * as ts from 'typescript';

const glob = promisify(globCallback);

const verbose = process.argv.includes('--verbose');

enum GenerateResult {
	Success,
	Skipped,
	NoComponent,
	Failed
}

export interface Config {
	tsConfig: string;
  	prettierConfig: string;
  	inputDir: string;
	outputDir?: string;
	fileMatch?: string;
}

export default async function generate({
	tsConfig: tsConfigPath,
  	prettierConfig: prettierConfigPath,
  	inputDir,
	outputDir,
	fileMatch = '*.ts'
}: Config) {
	const tsconfig = loader.loadConfig(path.resolve(__dirname, tsConfigPath));
	const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, prettierConfigPath));

	const allFiles = await Promise.all(
		[, path.resolve(__dirname, inputDir)].map(folderPath => {
			return glob('*.ts', {
				absolute: true,
				cwd: folderPath
			});
		})
	);
	const files = _.compact(_.flatten(allFiles));
	const program = parser.createProgram(files, tsconfig);

	const promises = files.map<Promise<GenerateResult>>(async tsFilePath => {
		const jsFilePath = tsFilePath.replace('.ts', '.js');
		return generateProptypesForFile(tsFilePath, jsFilePath, prettierConfig, program);
	});

	const results = await Promise.all(promises);

	if (verbose) {
		files.forEach((file, index) => {
			console.log('%s - %s', GenerateResult[results[index]], path.basename(file, '.ts'));
		});
	}

	console.log('--- Summary ---');
	const groups = _.groupBy(results, x => x);

	_.forOwn(groups, (count, key) => {
		console.log('%s: %d', GenerateResult[(key as unknown) as GenerateResult], count.length);
	});

	console.log('Total: %d', results.length);
}

async function generateProptypesForFile(
	tsFile: string,
	jsFile: string,
	prettierConfig: prettier.Options | null,
	program: ts.Program
): Promise<GenerateResult> {
	const proptypes = parser.parseFromProgram(tsFile, program, {
		shouldResolveObject: ({ name }) => {
			if (name.toLowerCase().endsWith('classes') || name === 'theme' || name.endsWith('Props')) {
				return false;
			}
			return undefined;
		}
	});
	if (proptypes.body.length === 0) {
		return GenerateResult.NoComponent;
	}

	proptypes.body.forEach(component => {
		component.types.forEach(prop => {
			if (prop.name === 'classes' && prop.jsDoc) {
				prop.jsDoc += '\nSee [CSS API](#css) below for more details.';
			} else if (prop.name === 'children' && !prop.jsDoc) {
				prop.jsDoc = 'The content of the component.';
			} else if (!prop.jsDoc) {
				prop.jsDoc = '@ignore';
			}
		});
	});

	const result = injector.inject(proptypes);
	if (!result) {
		return GenerateResult.Failed;
	}

	const prettified = prettier.format(result, {
		...prettierConfig,
		filepath: jsFile
	});
	await fse.writeFile(jsFile, prettified);
	return GenerateResult.Success;
}
