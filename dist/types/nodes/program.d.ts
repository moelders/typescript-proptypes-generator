import { Node } from './baseNodes';
import { ComponentNode } from './component';
export interface ProgramNode extends Node {
    body: ComponentNode[];
}
export declare function programNode(body?: ComponentNode[]): ProgramNode;
export declare function isProgramNode(node: Node): node is ProgramNode;
