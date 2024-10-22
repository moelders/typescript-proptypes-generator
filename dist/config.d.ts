import * as ts from 'typescript';
import * as prettier from 'prettier';
/**
 * Loads and parses a `tsconfig` file and returns a `ts.CompilerOptions` object
 * @param tsConfigPath The location for a `tsconfig.json` file
 */
export declare function loadTSConfig(tsConfigPath: string): ts.CompilerOptions;
export declare function loadPrettierConfig(prettierConfigPath: string): prettier.Options | null;
export declare function getAbsolutePath(relativePath: string): string;
