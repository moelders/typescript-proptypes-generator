import { Node } from '../nodes/baseNodes';
export interface ArrayNode extends Node {
    arrayType: Node;
}
export declare function arrayNode(arrayType: Node): ArrayNode;
export declare function isArrayNode(node: Node): node is ArrayNode;
