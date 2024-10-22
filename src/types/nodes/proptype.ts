import * as ts from 'typescript';
import * as t from '../../types';
import { PROP_TYPE_REQUIRED_FLAGS } from '../../constants';
import { Node } from './baseNodes';

const typeString = 'PropTypeNode';

export type FlagsExtended = ts.Symbol['flags'] & { PropertyOptional: 16777220 };
export interface PropTypeNode extends Node {
	name: string;
	jsDoc?: string;
	propType: Node;
	flags: FlagsExtended;
}

export function propTypeNode(
	name: string,
	jsDoc: string | undefined,
	propType: Node,
	flags: FlagsExtended
): PropTypeNode {
	return {
		type: typeString,
		name,
		jsDoc,
		propType,
		flags,
	};
}

export function isPropTypeNode(node: Node): node is PropTypeNode {
	return node.type === typeString;
}

export function isRequired(node: t.PropTypeNode): boolean {
	return PROP_TYPE_REQUIRED_FLAGS.includes(node.flags);
}
