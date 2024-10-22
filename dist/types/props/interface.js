"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceNode = interfaceNode;
exports.isInterfaceNode = isInterfaceNode;
var typeString = 'InterfaceNode';
function interfaceNode(types) {
    return {
        type: typeString,
        types: types || [],
    };
}
function isInterfaceNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=interface.js.map