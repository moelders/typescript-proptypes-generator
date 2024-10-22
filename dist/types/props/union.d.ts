import { Node } from '../nodes/baseNodes';
export interface UnionNode extends Node {
    types: Node[];
}
export declare function unionNode(types: Node[]): UnionNode;
export declare function isUnionNode(node: Node): node is UnionNode;
