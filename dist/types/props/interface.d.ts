import { Node, DefinitionHolder } from '../nodes/baseNodes';
import { PropTypeNode } from '../nodes/proptype';
export interface InterfaceNode extends DefinitionHolder {
}
export declare function interfaceNode(types?: PropTypeNode[]): InterfaceNode;
export declare function isInterfaceNode(node: Node): node is InterfaceNode;
