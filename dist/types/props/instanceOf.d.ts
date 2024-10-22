import { Node } from '../nodes/baseNodes';
export interface InstanceOfNode extends Node {
    instance: string;
}
export declare function instanceOfNode(instance: string): InstanceOfNode;
export declare function isInstanceOfNode(node: Node): node is InstanceOfNode;
