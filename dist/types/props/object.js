"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectNode = objectNode;
exports.isObjectNode = isObjectNode;
var typeString = 'ObjectNode';
function objectNode() {
    return {
        type: typeString,
    };
}
function isObjectNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=object.js.map