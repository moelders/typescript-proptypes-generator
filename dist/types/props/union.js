"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionNode = unionNode;
exports.isUnionNode = isUnionNode;
var typeString = 'UnionNode';
function unionNode(types) {
    var flatTypes = [];
    flattenTypes(types);
    function flattenTypes(nodes) {
        nodes.forEach(function (x) {
            if (isUnionNode(x)) {
                flattenTypes(x.types);
            }
            else {
                flatTypes.push(x);
            }
        });
    }
    return {
        type: typeString,
        types: flatTypes,
    };
}
function isUnionNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=union.js.map