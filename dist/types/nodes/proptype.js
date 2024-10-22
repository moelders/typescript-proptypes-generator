"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propTypeNode = propTypeNode;
exports.isPropTypeNode = isPropTypeNode;
exports.isRequired = isRequired;
var constants_1 = require("../../constants");
var typeString = 'PropTypeNode';
function propTypeNode(name, jsDoc, propType, flags) {
    return {
        type: typeString,
        name: name,
        jsDoc: jsDoc,
        propType: propType,
        flags: flags,
    };
}
function isPropTypeNode(node) {
    return node.type === typeString;
}
function isRequired(node) {
    return constants_1.PROP_TYPE_REQUIRED_FLAGS.includes(node.flags);
}
//# sourceMappingURL=proptype.js.map