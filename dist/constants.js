"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROP_TYPE_NODE_NAMES = exports.PROP_TYPE_REQUIRED_FLAGS = void 0;
var typescript_1 = require("typescript");
exports.PROP_TYPE_REQUIRED_FLAGS = [
    typescript_1.SymbolFlags.Property,
    typescript_1.SymbolFlags.PropertyExcludes,
    typescript_1.SymbolFlags.PropertyOrAccessor,
];
exports.PROP_TYPE_NODE_NAMES = [
    'React.Component',
    'React.ElementType',
    'React.ComponentType',
    'React.ReactElement',
    'ReactNodeLike',
    'ReactElementLike'
];
//# sourceMappingURL=constants.js.map