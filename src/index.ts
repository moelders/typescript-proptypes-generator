import fse from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import * as injector from './injector';
import * as configure from './config';
import * as parser from './parser';
import * as prettier from 'prettier';
import globCallback from 'glob';
import { promisify } from 'util';
import * as ts from 'typescript';

const glob = promisify(globCallback);

export interface Config {
	tsConfig: string;
	prettierConfig: string;
	inputPattern: string | string[];
	ignorePattern?: string | string[];
	outputDir?: string;
	verbose?: boolean,
}

export default async function generate({
	tsConfig: tsConfigPath,
	prettierConfig: prettierConfigPath,
	inputPattern,
	ignorePattern,
	outputDir,
	verbose = false
}: Config) {
	const inputPaths = _.isString(inputPattern) ? [inputPattern] : inputPattern;
	const absoluteTsConfigPath = configure.getAbsolutePath(tsConfigPath);
	const absolutePrettierConfigPath = prettierConfigPath ? configure.getAbsolutePath(prettierConfigPath) : null;
	const absoluteInputPatterns = inputPaths.map(configure.getAbsolutePath);
	const absoluteOutputDir = outputDir && configure.getAbsolutePath(outputDir);
	const tsconfig = configure.loadTSConfig(tsConfigPath);
	const prettierConfig = absolutePrettierConfigPath ? configure.loadPrettierConfig(absolutePrettierConfigPath) : null;
	const allFiles = await Promise.all(
		absoluteInputPatterns.map(absoluteInputPattern => {
			return glob(absoluteInputPattern, {
				ignore: ignorePattern,
				absolute: true,
			});
		})
	);
	const files = _.compact(_.flatten(allFiles));

	const program = parser.createProgram(files, tsconfig);

	const promises = files.map<Promise<void>>(async inputFilePath => {
		const inputFileExt = path.extname(inputFilePath);
		if (absoluteOutputDir) {
			const outputFileName = path.basename(inputFilePath).replace(inputFileExt, '.js');
			const outputFilePath = path.resolve(absoluteOutputDir ?? '', outputFileName);
			return generateProptypesForFile(inputFilePath, outputFilePath, prettierConfig, program, { verbose });
		}
		// If no output directory was provided, put generated JS the file adjacent to the input file
		const outputFilePath = inputFilePath.replace(inputFileExt, '.js');
		return generateProptypesForFile(inputFilePath, outputFilePath, prettierConfig, program, { verbose });
	});

	await Promise.all(promises);
}

async function generateProptypesForFile(
	inputFilePath: string,
	outputFilePath: string,
	prettierConfig: prettier.Options | null,
	program: ts.Program,
	options: { verbose: boolean }
): Promise<void> {
	const proptypes = parser.parseFromProgram(inputFilePath, program, options);

	const result = injector.inject(inputFilePath, outputFilePath, proptypes, { verbose: options.verbose });

	if (!result) {
		throw new Error(`Failed to generate prop types for ${inputFilePath}`);
	}

	if (prettierConfig) {
		const prettified = prettier.format(result, {
			...prettierConfig,
			filepath: outputFilePath
		});
		return fse.outputFile(outputFilePath, prettified);
	}

	return fse.outputFile(outputFilePath, result);
}
