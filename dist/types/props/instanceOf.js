"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfNode = instanceOfNode;
exports.isInstanceOfNode = isInstanceOfNode;
var typeString = 'InstanceOfNode';
function instanceOfNode(instance) {
    return {
        type: typeString,
        instance: instance,
    };
}
function isInstanceOfNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=instanceOf.js.map