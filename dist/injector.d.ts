import * as t from './types/index';
/**
 * Injects the PropTypes from parsing each typescript file into a corresponding JavaScript file.
 * @param propTypes Result from `parse` to inject into the JavaScript code
 */
export declare function inject(inputFilePath: string, outputFilePath: string, propTypes: t.ProgramNode, { verbose }: {
    verbose?: boolean;
}): string | null;
