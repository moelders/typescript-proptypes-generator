"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
var t = __importStar(require("./types"));
var lodash_1 = require("lodash");
/**
 * Generates code from the given node
 * @param node The node to convert to code
 * @param options The options used to control the way the code gets generated
 */
function generate(node, options) {
    if (options === void 0) { options = {}; }
    var _a = options.sortProptypes, sortProptypes = _a === void 0 ? true : _a, _b = options.importedName, importedName = _b === void 0 ? 'PropTypes' : _b, _c = options.includeJSDoc, includeJSDoc = _c === void 0 ? true : _c, shouldInclude = options.shouldInclude, verbose = options.verbose;
    function jsDoc(node) {
        if (!includeJSDoc || !node.jsDoc) {
            return '';
        }
        return "/**\n* ".concat(node.jsDoc.split(/\r?\n/).reduce(function (prev, curr) { return prev + '\n* ' + curr; }), "\n*/\n");
    }
    if (Array.isArray(node)) {
        var propTypes = node;
        if (typeof sortProptypes === 'function') {
            propTypes = propTypes.sort(sortProptypes);
        }
        else if (sortProptypes === true) {
            propTypes = propTypes.sort(function (a, b) { return a.name.localeCompare(b.name); });
        }
        var filteredNodes = node;
        if (shouldInclude) {
            filteredNodes = filteredNodes.filter(function (x) { return shouldInclude(x); });
        }
        return filteredNodes
            .map(function (prop) { return generate(prop, options); })
            .reduce(function (prev, curr) { return "".concat(prev, "\n").concat(curr); });
    }
    if (t.isProgramNode(node)) {
        return node.body
            .map(function (prop) { return generate(prop, options); })
            .reduce(function (prev, curr) { return "".concat(prev, "\n").concat(curr); });
    }
    if (t.isComponentNode(node)) {
        var comment = options.comment &&
            "// ".concat(options.comment.split(/\r?\n/gm).reduce(function (prev, curr) { return "".concat(prev, "\n// ").concat(curr); }), "\n");
        return "export const ".concat(node.name, " = {\n").concat(comment ? comment : '').concat(generate(node.types, options), "\n}");
    }
    if (t.isPropTypeNode(node)) {
        var propType = __assign({}, node.propType);
        if (t.isUnionNode(propType) && propType.types.some(t.isUndefinedNode)) {
            propType.types = propType.types.filter(function (prop) { return !t.isUndefinedNode(prop) && !(t.isLiteralNode(prop) && prop.value === 'null'); });
            if (propType.types.length === 1 && t.isLiteralNode(propType.types[0]) === false) {
                propType = propType.types[0];
            }
        }
        return "".concat(jsDoc(node), "\"").concat(node.name, "\": ").concat(generate(propType, options)).concat(t.isRequired(node) ? '.isRequired' : '', ",");
    }
    if (t.isInterfaceNode(node)) {
        return "".concat(importedName, ".shape({\n").concat(generate(node.types, __assign(__assign({}, options), { shouldInclude: undefined })), "\n})");
    }
    if (t.isFunctionNode(node)) {
        return "".concat(importedName, ".func");
    }
    if (t.isStringNode(node)) {
        return "".concat(importedName, ".string");
    }
    if (t.isBooleanNode(node)) {
        return "".concat(importedName, ".bool");
    }
    if (t.isNumericNode(node)) {
        return "".concat(importedName, ".number");
    }
    if (t.isLiteralNode(node)) {
        return "".concat(importedName, ".oneOf([").concat(jsDoc(node)).concat(node.value, "])");
    }
    if (t.isObjectNode(node)) {
        return "".concat(importedName, ".object");
    }
    if (t.isAnyNode(node)) {
        return "".concat(importedName, ".any");
    }
    if (t.isElementNode(node)) {
        return "".concat(importedName, ".").concat(node.elementType);
    }
    if (t.isInstanceOfNode(node)) {
        return "".concat(importedName, ".instanceOf(").concat(node.instance, ")");
    }
    if (t.isArrayNode(node)) {
        if (t.isAnyNode(node.arrayType)) {
            return "".concat(importedName, ".array");
        }
        return "".concat(importedName, ".arrayOf(").concat(generate(node.arrayType, options), ")");
    }
    if (t.isUnionNode(node)) {
        var _d = (0, lodash_1.partition)(node.types, t.isLiteralNode), literals = _d[0], rest = _d[1];
        literals = (0, lodash_1.uniqBy)(literals, function (x) { return x.value; });
        rest = (0, lodash_1.uniqBy)(rest, function (x) { return (t.isInstanceOfNode(x) ? "".concat(x.type, ".").concat(x.instance) : x.type); });
        if ((0, lodash_1.every)(literals, function (literal) { return (0, lodash_1.isString)(literal); })) {
            literals = literals.sort(function (a, b) { return a.value.localeCompare(b.value); });
        }
        else if ((0, lodash_1.every)(literals, lodash_1.isNumber)) {
            literals = literals.sort();
        }
        var nodeToStringName_1 = function (obj) {
            if (t.isInstanceOfNode(obj)) {
                return "".concat(obj.type, ".").concat(obj.instance);
            }
            else if (t.isInterfaceNode(obj)) {
                // An interface is PropTypes.shape
                // Use `ShapeNode` to get it sorted in the correct order
                return "ShapeNode";
            }
            return obj.type;
        };
        rest = rest.sort(function (a, b) { return nodeToStringName_1(a).localeCompare(nodeToStringName_1(b)); });
        if (literals.find(function (x) { return x.value === 'true'; }) && literals.find(function (x) { return x.value === 'false'; })) {
            rest.push(t.booleanNode());
            literals = literals.filter(function (x) { return x.value !== 'true' && x.value !== 'false'; });
        }
        var literalProps = literals.length !== 0
            ? "".concat(importedName, ".oneOf([").concat(literals
                .map(function (x) { return "".concat(jsDoc(x)).concat(x.value); })
                .reduce(function (prev, curr) { return "".concat(prev, ",").concat(curr); }), "])")
            : '';
        if (rest.length === 0) {
            return literalProps;
        }
        if (literals.length === 0 && rest.length === 1) {
            return generate(rest[0], options);
        }
        return "".concat(importedName, ".oneOfType([").concat(literalProps ? literalProps + ', ' : '').concat(rest
            .map(function (x) { return generate(x, options); })
            .reduce(function (prev, curr) { return "".concat(prev, ",").concat(curr); }), "])");
    }
    if (verbose) {
        console.warn("Nothing to handle node of type \"".concat(node.type, "\""));
    }
    return '';
}
//# sourceMappingURL=generator.js.map