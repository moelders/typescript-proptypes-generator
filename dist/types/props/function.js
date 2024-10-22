"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionNode = functionNode;
exports.isFunctionNode = isFunctionNode;
var typeString = 'FunctionNode';
function functionNode() {
    return {
        type: typeString,
    };
}
function isFunctionNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=function.js.map