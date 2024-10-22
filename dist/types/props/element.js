"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementNode = elementNode;
exports.isElementNode = isElementNode;
var typeString = 'ElementNode';
function elementNode(elementType) {
    return {
        type: typeString,
        elementType: elementType,
    };
}
function isElementNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=element.js.map