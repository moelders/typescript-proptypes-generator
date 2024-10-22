"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undefinedNode = undefinedNode;
exports.isUndefinedNode = isUndefinedNode;
var typeString = 'UndefinedNode';
function undefinedNode() {
    return {
        type: typeString,
    };
}
function isUndefinedNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=undefined.js.map