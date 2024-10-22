"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentNode = componentNode;
exports.isComponentNode = isComponentNode;
var typeString = 'ComponentNode';
function componentNode(name, types) {
    return {
        type: typeString,
        name: name,
        types: types || [],
    };
}
function isComponentNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=component.js.map