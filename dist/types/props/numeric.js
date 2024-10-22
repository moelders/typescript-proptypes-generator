"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numericNode = numericNode;
exports.isNumericNode = isNumericNode;
var typeString = 'NumericNode';
function numericNode() {
    return {
        type: typeString,
    };
}
function isNumericNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=numeric.js.map