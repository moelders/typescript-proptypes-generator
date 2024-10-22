import { Node } from '../nodes/baseNodes';
export interface LiteralNode extends Node {
    value: any;
    jsDoc?: string;
}
export declare function literalNode(value: any, jsDoc?: string): LiteralNode;
export declare function isLiteralNode(node: Node): node is LiteralNode;
