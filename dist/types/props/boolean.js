"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanNode = booleanNode;
exports.isBooleanNode = isBooleanNode;
var typeString = 'BooleanNode';
function booleanNode() {
    return {
        type: typeString,
    };
}
function isBooleanNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=boolean.js.map