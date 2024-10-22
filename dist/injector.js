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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = inject;
var babel = __importStar(require("@babel/core"));
var generator = __importStar(require("./generator"));
var uuid_1 = require("uuid");
var path_1 = __importDefault(require("path"));
/**
 * Injects the PropTypes from parsing each typescript file into a corresponding JavaScript file.
 * @param propTypes Result from `parse` to inject into the JavaScript code
 */
function inject(inputFilePath, outputFilePath, propTypes, _a) {
    var verbose = _a.verbose;
    if (propTypes.body.length === 0) {
        return null;
    }
    var propTypesToInject = new Map();
    // Since the JS proptypes are being generated from scratch, the source to the babel transform
    // is empty.
    var sourceContent = '';
    var result = babel.transformSync(sourceContent, {
        plugins: [
            require.resolve('@babel/plugin-syntax-class-properties'),
            [require.resolve('@babel/plugin-transform-typescript'), { allExtensions: true, isTSX: true }],
            plugin(propTypes, propTypesToInject, inputFilePath, outputFilePath, { verbose: verbose })
        ],
        presets: ['@babel/preset-react'],
        configFile: false,
        babelrc: false,
        retainLines: true
    });
    var code = result && result.code;
    if (!code) {
        return null;
    }
    // Inject new lines between statements
    propTypesToInject.forEach(function (value, key) {
        code = code.replace(key, "\n\n".concat(value, "\n\n"));
    });
    return code;
}
function addStatementWithWhitespace(mapOfPropTypes, source) {
    // Hack to inject new lines between statements
    var placeholder = "const a".concat((0, uuid_1.v4)().replace(/\-/g, '_'), " = null;");
    mapOfPropTypes.set(placeholder, source);
    return babel.template.statement.ast(placeholder);
}
function plugin(propTypes, mapOfPropTypes, inputFilePath, outputFilePath, _a) {
    var verbose = _a.verbose;
    return {
        visitor: {
            Program: {
                enter: function (visitPath) {
                    var relativeInputFilePath = path_1.default.relative(outputFilePath, inputFilePath);
                    visitPath.addComment('leading', "\nAUTO-GENERATED EDIT AT YOUR OWN PERIL:\nThese propTypes were auto-generated from the TypeScript definitions in: ".concat(relativeInputFilePath, "\n"));
                    visitPath.node.body = [
                        addStatementWithWhitespace(mapOfPropTypes, "import PropTypes from 'prop-types'")
                    ];
                    propTypes.body.forEach(function (props) {
                        var source = generator.generate(props, { verbose: verbose });
                        visitPath.pushContainer('body', addStatementWithWhitespace(mapOfPropTypes, source));
                    });
                }
            }
        }
    };
}
//# sourceMappingURL=injector.js.map