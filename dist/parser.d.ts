import * as ts from 'typescript';
import * as t from './types';
/**
 * Options that specify how the parser should act
 */
interface ParserOptions {
    /**
     * Called before a PropType is added to a component/object
     * @return true to include the PropType, false to skip it, or undefined to
     * use the default behaviour
     * @default name !== 'ref'
     */
    shouldInclude: (data: {
        name: string;
        depth: number;
    }) => boolean | undefined;
    /**
     * Called before the shape of an object is resolved
     * @return true to resolve the shape of the object, false to just use a object, or undefined to
     * use the default behaviour
     * @default propertyCount <= 50 && depth <= 3
     */
    shouldResolveObject: (data: {
        name: string;
        propertyCount: number;
        depth: number;
    }) => boolean | undefined;
    /**
     * Control if const declarations should be checked
     * @default false
     * @example declare const Component: React.ComponentType<Props>;
     */
    checkDeclarations?: boolean;
    verbose: boolean;
}
/**
 * A wrapper for `ts.createProgram`
 * @param files The files to later be parsed with `parseFromProgram`
 * @param options The options to pass to the compiler
 */
export declare function createProgram(files: string[], options: ts.CompilerOptions): ts.Program;
/**
 * Creates a program, parses the specified file and returns the PropTypes as an AST, if you need to parse more than one file
 * use `createProgram` and `parseFromProgram` for better performance
 * @param filePath The file to parse
 * @param options The options from `loadConfig`
 * @param parserOptions Options that specify how the parser should act
 */
export declare function parseFile(filePath: string, options: ts.CompilerOptions, parserOptions?: Partial<ParserOptions>): t.ProgramNode;
/**
 * Parses the specified file and returns the PropTypes as an AST
 * @param filePath The file to get the PropTypes from
 * @param program The program object returned by `createProgram`
 * @param parserOptions Options that specify how the parser should act
 */
export declare function parseFromProgram(filePath: string, program: ts.Program, parserOptions?: Partial<ParserOptions>): t.ProgramNode;
export {};
