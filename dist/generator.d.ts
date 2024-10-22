import * as t from './types';
export interface GenerateOptions {
    /**
     * Enable/disable the default sorting (ascending) or provide your own sort function
     * @default true
     */
    sortProptypes?: boolean | ((a: t.PropTypeNode, b: t.PropTypeNode) => 0 | -1 | 1);
    /**
     * The name used when importing prop-types
     * @default 'PropTypes'
     */
    importedName?: string;
    /**
     * Enable/disable including JSDoc comments
     * @default true
     */
    includeJSDoc?: boolean;
    /**
     * Control which PropTypes are included in the final result
     * @param proptype The current PropType about to be converted to text
     */
    shouldInclude?(proptype: t.PropTypeNode): boolean | undefined;
    /**
     * A comment that will be added to the start of the PropTypes code block
     * @example
     * foo.propTypes = {
     *  // Comment goes here
     * }
     */
    comment?: string;
    /**
     * Logging enabled.
     */
    verbose?: boolean;
}
/**
 * Generates code from the given node
 * @param node The node to convert to code
 * @param options The options used to control the way the code gets generated
 */
export declare function generate(node: t.Node | t.PropTypeNode[], options?: GenerateOptions): string;
