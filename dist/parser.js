"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = createProgram;
exports.parseFile = parseFile;
exports.parseFromProgram = parseFromProgram;
var ts = __importStar(require("typescript"));
var t = __importStar(require("./types"));
var doctrine = __importStar(require("doctrine"));
var constants_1 = require("./constants");
/**
 * A wrapper for `ts.createProgram`
 * @param files The files to later be parsed with `parseFromProgram`
 * @param options The options to pass to the compiler
 */
function createProgram(files, options) {
    return ts.createProgram(files, options);
}
/**
 * Creates a program, parses the specified file and returns the PropTypes as an AST, if you need to parse more than one file
 * use `createProgram` and `parseFromProgram` for better performance
 * @param filePath The file to parse
 * @param options The options from `loadConfig`
 * @param parserOptions Options that specify how the parser should act
 */
function parseFile(filePath, options, parserOptions) {
    if (parserOptions === void 0) { parserOptions = {}; }
    var program = ts.createProgram([filePath], options);
    return parseFromProgram(filePath, program, parserOptions);
}
/**
 * Parses the specified file and returns the PropTypes as an AST
 * @param filePath The file to get the PropTypes from
 * @param program The program object returned by `createProgram`
 * @param parserOptions Options that specify how the parser should act
 */
function parseFromProgram(filePath, program, parserOptions) {
    if (parserOptions === void 0) { parserOptions = {}; }
    var _a = parserOptions.checkDeclarations, checkDeclarations = _a === void 0 ? false : _a;
    var shouldInclude = function (data) {
        if (parserOptions.shouldInclude) {
            var result = parserOptions.shouldInclude(data);
            if (result !== undefined) {
                return result;
            }
        }
        return data.name !== 'ref';
    };
    var shouldResolveObject = function (data) {
        if (parserOptions.shouldResolveObject) {
            var result = parserOptions.shouldResolveObject(data);
            if (result !== undefined) {
                return result;
            }
        }
        return data.propertyCount <= 50 && data.depth <= 3;
    };
    var checker = program.getTypeChecker();
    var sourceFile = program.getSourceFile(filePath);
    var programNode = t.programNode();
    var reactImports = [];
    if (sourceFile) {
        ts.forEachChild(sourceFile, visit);
    }
    else {
        throw new Error("Program doesn't contain file \"".concat(filePath, "\""));
    }
    return programNode;
    function visit(node) {
        if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
            var type = checker.getTypeAtLocation(node.name);
            if (!type.isLiteral() && !type.isUnion()) {
                try {
                    parsePropsType(node.name.getText(), type);
                }
                catch (e) {
                    if (parserOptions.verbose) {
                        console.warn("Failed to parse ".concat(node.name.getText(), ": ").concat(e));
                    }
                }
            }
        }
    }
    function parsePropsType(name, type) {
        var properties = type
            .getProperties()
            .filter(function (symbol) { return shouldInclude({ name: symbol.getName(), depth: 1 }); });
        if (properties.length === 0) {
            return;
        }
        programNode.body.push(t.componentNode(name, properties.map(function (x) { return checkSymbol(x, [type.id]); })));
    }
    function checkSymbol(symbol, typeStack) {
        var declarations = symbol.getDeclarations();
        var declaration = declarations && declarations[0];
        // TypeChecker keeps the name for
        // { a: React.ElementType, b: React.ReactElement | boolean }
        // but not
        // { a?: React.ElementType, b: React.ReactElement }
        // get around this by not using the TypeChecker
        if (declaration &&
            ts.isPropertySignature(declaration) &&
            declaration.type &&
            ts.isTypeReferenceNode(declaration.type)) {
            var name = declaration.type.typeName.getText();
            if (constants_1.PROP_TYPE_NODE_NAMES.includes(name)) {
                var elementNode = t.elementNode(name === 'React.ReactElement' ? 'element' : 'elementType');
                return t.propTypeNode(symbol.getName(), getDocumentation(symbol), declaration.questionToken ? t.unionNode([t.undefinedNode(), elementNode]) : elementNode, symbol.getFlags());
            }
        }
        var type = declaration
            ? // The proptypes aren't detailed enough that we need all the different combinations
                // so we just pick the first and ignore the rest
                checker.getTypeOfSymbolAtLocation(symbol, declaration)
            : // The properties of Record<..., ...> don't have a declaration, but the symbol has a type property
                symbol.type;
        // Typechecker only gives the type "any" if it's present in a union
        // This means the type of "a" in {a?:any} isn't "any | undefined"
        // So instead we check for the questionmark to detect optional types
        var parsedType = undefined;
        if (type) {
            if (type.flags & ts.TypeFlags.Any && declaration && ts.isPropertySignature(declaration)) {
                parsedType = declaration.questionToken
                    ? t.unionNode([t.undefinedNode(), t.anyNode()])
                    : t.anyNode();
            }
            else {
                parsedType = checkType(type, typeStack, symbol.getName());
            }
        }
        else {
            parsedType = checkType({}, typeStack, symbol.getName());
        }
        return t.propTypeNode(symbol.getName(), getDocumentation(symbol), parsedType, symbol.getFlags());
    }
    function checkType(type, typeStack, name) {
        // If the typeStack contains type.id we're dealing with an object that references itself.
        // To prevent getting stuck in an infinite loop we just set it to an objectNode
        if (typeStack.includes(type.id)) {
            return t.objectNode();
        }
        {
            var typeNode = type;
            var symbol = typeNode.aliasSymbol ? typeNode.aliasSymbol : typeNode.symbol;
            var typeName = symbol ? checker.getFullyQualifiedName(symbol) : null;
            switch (typeName) {
                case 'global.JSX.Element':
                case 'React.ReactElement': {
                    return t.elementNode('element');
                }
                case 'React.ElementType': {
                    return t.elementNode('elementType');
                }
                case 'React.ReactPortal':
                case 'React.ReactNode': {
                    return t.unionNode([t.elementNode('node'), t.undefinedNode()]);
                }
                case 'React.Component': {
                    return t.instanceOfNode(typeName);
                }
                case 'Element': {
                    // Nextjs: Element isn't defined on the server
                    return t.instanceOfNode("typeof Element === 'undefined' ? Object : Element");
                }
            }
        }
        // @ts-ignore - Private method
        if (checker.isArrayType(type)) {
            // @ts-ignore - Private method
            var arrayType = checker.getElementTypeOfArrayType(type);
            return t.arrayNode(checkType(arrayType, typeStack, name));
        }
        if (typeof type.isUnion === 'function' && type.isUnion()) {
            return t.unionNode(type.types.map(function (x) { return checkType(x, typeStack, name); }));
        }
        if (type.flags & ts.TypeFlags.String) {
            return t.stringNode();
        }
        if (type.flags & ts.TypeFlags.Number) {
            return t.numericNode();
        }
        if (type.flags & ts.TypeFlags.Undefined) {
            return t.undefinedNode();
        }
        if (type.flags & ts.TypeFlags.Any || type.flags & ts.TypeFlags.Unknown) {
            return t.anyNode();
        }
        if (type.flags & ts.TypeFlags.Literal) {
            if (type.isLiteral()) {
                return t.literalNode(type.isStringLiteral() ? "\"".concat(type.value, "\"") : type.value, getDocumentation(type.symbol));
            }
            return t.literalNode(checker.typeToString(type));
        }
        if (type.flags & ts.TypeFlags.Null) {
            return t.literalNode('null');
        }
        if (typeof type.getCallSignatures === 'function' && type.getCallSignatures().length) {
            return t.functionNode();
        }
        // Object-like type
        {
            var properties = typeof type.getProperties === 'function' ? type.getProperties() : [];
            if (properties.length) {
                if (shouldResolveObject({ name: name, propertyCount: properties.length, depth: typeStack.length })) {
                    var filtered = properties.filter(function (symbol) {
                        return shouldInclude({ name: symbol.getName(), depth: typeStack.length + 1 });
                    });
                    if (filtered.length > 0) {
                        return t.interfaceNode(filtered.map(function (x) { return checkSymbol(x, __spreadArray(__spreadArray([], typeStack, true), [type.id], false)); }));
                    }
                }
                return t.objectNode();
            }
        }
        // Object without properties or object keyword
        if (type.flags & ts.TypeFlags.Object ||
            (type.flags & ts.TypeFlags.NonPrimitive && checker.typeToString(type) === 'object')) {
            return t.objectNode();
        }
        if (parserOptions.verbose) {
            console.warn("Unable to handle node of ".concat(type.flags && ts.TypeFlags[type.flags]
                ? "type \"ts.TypeFlags.".concat(ts.TypeFlags[type.flags], "\"")
                : 'undefined type', ", using \"any\""));
        }
        return t.anyNode();
    }
    function getDocumentation(symbol) {
        if (!symbol) {
            return undefined;
        }
        var decl = symbol.getDeclarations();
        if (decl) {
            // @ts-ignore - Private method
            var comments = ts.getJSDocCommentsAndTags(decl[0]);
            if (comments && comments.length === 1) {
                var commentNode = comments[0];
                if (ts.isJSDoc(commentNode)) {
                    return doctrine.unwrapComment(commentNode.getText()).trim();
                }
            }
        }
        var comment = ts.displayPartsToString(symbol.getDocumentationComment(checker));
        return comment ? comment : undefined;
    }
}
//# sourceMappingURL=parser.js.map