"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programNode = programNode;
exports.isProgramNode = isProgramNode;
var typeString = 'ProgramNode';
function programNode(body) {
    return {
        type: typeString,
        body: body || [],
    };
}
function isProgramNode(node) {
    return node.type === typeString;
}
//# sourceMappingURL=program.js.map