"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayNode = arrayNode;
exports.isArrayNode = isArrayNode;
var typeString = 'ArrayNode';
function arrayNode(arrayType) {
    return {
        type: typeString,
        arrayType: arrayType,
    };
}
function isArrayNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=array.js.map