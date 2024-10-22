import * as ts from 'typescript';
import * as t from '../../types';
import { Node } from './baseNodes';
export type FlagsExtended = ts.Symbol['flags'] & {
    PropertyOptional: 16777220;
};
export interface PropTypeNode extends Node {
    name: string;
    jsDoc?: string;
    propType: Node;
    flags: FlagsExtended;
}
export declare function propTypeNode(name: string, jsDoc: string | undefined, propType: Node, flags: FlagsExtended): PropTypeNode;
export declare function isPropTypeNode(node: Node): node is PropTypeNode;
export declare function isRequired(node: t.PropTypeNode): boolean;
