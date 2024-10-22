"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyNode = anyNode;
exports.isAnyNode = isAnyNode;
var typeString = 'AnyNode';
function anyNode() {
    return {
        type: typeString,
    };
}
function isAnyNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=any.js.map