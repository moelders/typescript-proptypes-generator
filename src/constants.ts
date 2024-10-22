import { SymbolFlags } from 'typescript';

export const PROP_TYPE_REQUIRED_FLAGS = [
  SymbolFlags.Property,
  SymbolFlags.PropertyExcludes,
  SymbolFlags.PropertyOrAccessor,
];

export const PROP_TYPE_NODE_NAMES = [
  'React.Component',
  'React.ElementType',
  'React.ComponentType',
  'React.ReactElement',
  'ReactNodeLike',
  'ReactElementLike'
];
