"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literalNode = literalNode;
exports.isLiteralNode = isLiteralNode;
var typeString = 'LiteralNode';
function literalNode(value, jsDoc) {
    return {
        type: typeString,
        value: value,
        jsDoc: jsDoc,
    };
}
function isLiteralNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=literal.js.map