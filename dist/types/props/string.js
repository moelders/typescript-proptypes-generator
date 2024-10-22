"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringNode = stringNode;
exports.isStringNode = isStringNode;
var typeString = 'StringNode';
function stringNode() {
    return {
        type: typeString,
    };
}
function isStringNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=string.js.map