import * as ts from 'typescript';
import * as prettier from 'prettier';
import fs from 'fs';
import path from 'path';

/**
 * Loads and parses a `tsconfig` file and returns a `ts.CompilerOptions` object
 * @param tsConfigPath The location for a `tsconfig.json` file
 */
export function loadTSConfig(tsConfigPath: string) {
	const { config, error } = ts.readConfigFile(tsConfigPath, (filePath) =>
		fs.readFileSync(filePath).toString()
	);

	if (error) throw error;

	const { options, errors } = ts.parseJsonConfigFileContent(
		config,
		ts.sys,
		path.dirname(tsConfigPath)
	);

	if (errors.length > 0) throw errors[0];

	return options;
}

export function loadPrettierConfig(prettierConfigPath: string) { 
	return prettier.resolveConfig.sync(prettierConfigPath);
}

function isString(x: any): x is string {
    return typeof x === "string";
}

export function getAbsolutePath(relativePath: string): string {
	return path.resolve(process.cwd(), relativePath);
}