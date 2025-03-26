"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Colors", {
    enumerable: true,
    get: function() {
        return Colors;
    }
});
const _tagged_template_literal_loose = require("@swc/helpers/_/_tagged_template_literal_loose");
const _jsxruntime = require("react/jsx-runtime");
const _css = require("../../utils/css");
function _templateObject() {
    const data = _tagged_template_literal_loose._([
        '\n        :host {\n          /* \n           * CAUTION: THIS IS A WORKAROUND!\n           * For now, we use @babel/code-frame to parse the code frame which does not support option to change the color.\n           * x-ref: https://github.com/babel/babel/blob/efa52324ff835b794c48080f14877b6caf32cd15/packages/babel-code-frame/src/defs.ts#L40-L54\n           * So, we do a workaround mapping to change the color matching the theme.\n           *\n           * For example, in @babel/code-frame, the "keyword" is mapped to ANSI "cyan".\n           * We want the "keyword" to use the "syntax-keyword" color in the theme.\n           * So, we map the "cyan" to the "syntax-keyword" in the theme.\n           */\n          /* cyan: keyword */\n          --color-ansi-cyan: var(--color-syntax-keyword);\n          /* yellow: capitalized, jsxIdentifier, punctuation */\n          --color-ansi-yellow: var(--color-syntax-function);\n          /* magenta: number, regex */\n          --color-ansi-magenta: var(--color-syntax-keyword);\n          /* green: string */\n          --color-ansi-green: var(--color-syntax-string);\n          /* gray (bright black): comment, gutter */\n          --color-ansi-bright-black: var(--color-syntax-comment);\n\n          /* Ansi - Temporary */\n          --color-ansi-selection: var(--color-gray-alpha-300);\n          --color-ansi-bg: var(--color-background-200);\n          --color-ansi-fg: var(--color-gray-1000);\n\n          --color-ansi-white: var(--color-gray-700);\n          --color-ansi-black: var(--color-gray-200);\n          --color-ansi-blue: var(--color-blue-700);\n          --color-ansi-red: var(--color-red-700);\n          --color-ansi-bright-white: var(--color-gray-1000);\n          --color-ansi-bright-blue: var(--color-blue-800);\n          --color-ansi-bright-cyan: var(--color-blue-800);\n          --color-ansi-bright-green: var(--color-green-800);\n          --color-ansi-bright-magenta: var(--color-blue-800);\n          --color-ansi-bright-red: var(--color-red-800);\n          --color-ansi-bright-yellow: var(--color-amber-900);\n\n          /* Background Light */\n          --color-background-100: #ffffff;\n          --color-background-200: #fafafa;\n\n          /* Syntax Light */\n          --color-syntax-comment: #545454;\n          --color-syntax-constant: #171717;\n          --color-syntax-function: #0054ad;\n          --color-syntax-keyword: #a51850;\n          --color-syntax-link: #066056;\n          --color-syntax-parameter: #8f3e00;\n          --color-syntax-punctuation: #171717;\n          --color-syntax-string: #036157;\n          --color-syntax-string-expression: #066056;\n\n          /* Gray Scale Light */\n          --color-gray-100: #f2f2f2;\n          --color-gray-200: #ebebeb;\n          --color-gray-300: #e6e6e6;\n          --color-gray-400: #eaeaea;\n          --color-gray-500: #c9c9c9;\n          --color-gray-600: #a8a8a8;\n          --color-gray-700: #8f8f8f;\n          --color-gray-800: #7d7d7d;\n          --color-gray-900: #666666;\n          --color-gray-1000: #171717;\n\n          /* Gray Alpha Scale Light */\n          --color-gray-alpha-100: rgba(0, 0, 0, 0.05);\n          --color-gray-alpha-200: rgba(0, 0, 0, 0.081);\n          --color-gray-alpha-300: rgba(0, 0, 0, 0.1);\n          --color-gray-alpha-400: rgba(0, 0, 0, 0.08);\n          --color-gray-alpha-500: rgba(0, 0, 0, 0.21);\n          --color-gray-alpha-600: rgba(0, 0, 0, 0.34);\n          --color-gray-alpha-700: rgba(0, 0, 0, 0.44);\n          --color-gray-alpha-800: rgba(0, 0, 0, 0.51);\n          --color-gray-alpha-900: rgba(0, 0, 0, 0.605);\n          --color-gray-alpha-1000: rgba(0, 0, 0, 0.91);\n\n          /* Blue Scale Light */\n          --color-blue-100: #f0f7ff;\n          --color-blue-200: #edf6ff;\n          --color-blue-300: #e1f0ff;\n          --color-blue-400: #cde7ff;\n          --color-blue-500: #99ceff;\n          --color-blue-600: #52aeff;\n          --color-blue-700: #0070f3;\n          --color-blue-800: #0060d1;\n          --color-blue-900: #0067d6;\n          --color-blue-1000: #0025ad;\n\n          /* Red Scale Light */\n          --color-red-100: #fff0f0;\n          --color-red-200: #ffebeb;\n          --color-red-300: #ffe5e5;\n          --color-red-400: #fdd8d8;\n          --color-red-500: #f8baba;\n          --color-red-600: #f87274;\n          --color-red-700: #e5484d;\n          --color-red-800: #da3036;\n          --color-red-900: #ca2a30;\n          --color-red-1000: #381316;\n\n          /* Amber Scale Light */\n          --color-amber-100: #fff6e5;\n          --color-amber-200: #fff4d5;\n          --color-amber-300: #fef0cd;\n          --color-amber-400: #ffddbf;\n          --color-amber-500: #ffc96b;\n          --color-amber-600: #f5b047;\n          --color-amber-700: #ffb224;\n          --color-amber-800: #ff990a;\n          --color-amber-900: #a35200;\n          --color-amber-1000: #4e2009;\n\n          /* Green Scale Light */\n          --color-green-100: #effbef;\n          --color-green-200: #eafaea;\n          --color-green-300: #dcf6dc;\n          --color-green-400: #c8f1c9;\n          --color-green-500: #99e59f;\n          --color-green-600: #6cda76;\n          --color-green-700: #46a758;\n          --color-green-800: #388e4a;\n          --color-green-900: #297c3b;\n          --color-green-1000: #18311e;\n\n          /* Turbopack Light - Temporary */\n          --color-turbopack-text-red: #ff1e56;\n          --color-turbopack-text-blue: #0096ff;\n          --color-turbopack-border-red: #f0adbe;\n          --color-turbopack-border-blue: #adccea;\n          --color-turbopack-background-red: #fff7f9;\n          --color-turbopack-background-blue: #f6fbff;\n        }\n      '
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function Colors() {
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
        children: (0, _css.css)(_templateObject())
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=colors.js.map