import { Node, DefinitionHolder } from './baseNodes';
import { PropTypeNode } from './proptype';
export interface ComponentNode extends DefinitionHolder {
    name: string;
}
export declare function componentNode(name: string, types?: PropTypeNode[]): ComponentNode;
export declare function isComponentNode(node: Node): node is ComponentNode;
