"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Base", {
    enumerable: true,
    get: function() {
        return Base;
    }
});
const _tagged_template_literal_loose = require("@swc/helpers/_/_tagged_template_literal_loose");
const _jsxruntime = require("react/jsx-runtime");
const _css = require("../../utils/css");
function _templateObject() {
    const data = _tagged_template_literal_loose._([
        "\n        :host {\n          /* \n           * Although the style applied to the shadow host is isolated,\n           * the element that attached the shadow host (i.e. \"nextjs-portal\")\n           * is still affected by the parent's style (e.g. \"body\"). This may\n           * occur style conflicts like \"display: flex\", with other children\n           * elements therefore give the shadow host an absolute position.\n           */\n          position: absolute;\n\n          --color-font: #757575;\n          --color-backdrop: rgba(250, 250, 250, 0.8);\n          --color-border-shadow: rgba(0, 0, 0, 0.145);\n\n          --color-title-color: #1f1f1f;\n          --color-stack-notes: #777;\n\n          --color-accents-1: #808080;\n          --color-accents-2: #222222;\n          --color-accents-3: #404040;\n\n          --font-stack-monospace: '__nextjs-Geist Mono', 'Geist Mono',\n            'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier,\n            monospace;\n          --font-stack-sans: '__nextjs-Geist', 'Geist', -apple-system,\n            'Source Sans Pro', sans-serif;\n\n          font-family: var(--font-stack-sans);\n\n          /* TODO: Remove replaced ones. */\n          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),\n            0 1px 2px -1px rgb(0 0 0 / 0.1);\n          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),\n            0 2px 4px -2px rgb(0 0 0 / 0.1);\n          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),\n            0 4px 6px -4px rgb(0 0 0 / 0.1);\n          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),\n            0 8px 10px -6px rgb(0 0 0 / 0.1);\n          --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n          --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n          --shadow-none: 0 0 #0000;\n\n          --shadow-small: 0px 2px 2px rgba(0, 0, 0, 0.04);\n          --shadow-menu: 0px 1px 1px rgba(0, 0, 0, 0.02),\n            0px 4px 8px -4px rgba(0, 0, 0, 0.04),\n            0px 16px 24px -8px rgba(0, 0, 0, 0.06);\n\n          --focus-color: var(--color-blue-800);\n          --focus-ring: 2px solid var(--focus-color);\n\n          --timing-swift: cubic-bezier(0.23, 0.88, 0.26, 0.92);\n          --timing-overlay: cubic-bezier(0.175, 0.885, 0.32, 1.1);\n\n          --rounded-none: 0px;\n          --rounded-sm: 2px;\n          --rounded-md: 4px;\n          --rounded-md-2: 6px;\n          --rounded-lg: 8px;\n          --rounded-xl: 12px;\n          --rounded-2xl: 16px;\n          --rounded-3xl: 24px;\n          --rounded-4xl: 32px;\n          --rounded-full: 9999px;\n\n          /* \n            Suffix N of --size-N as px value when the base font size is 16px.\n            Example: --size-1 is 1px, --size-2 is 2px, --size-3 is 3px, etc.\n          */\n          --size-1: 0.0625rem; /* 1px */\n          --size-2: 0.125rem; /* 2px */\n          --size-3: 0.1875rem; /* 3px */\n          --size-4: 0.25rem; /* ...and more */\n          --size-5: 0.3125rem;\n          --size-6: 0.375rem;\n          --size-7: 0.4375rem;\n          --size-8: 0.5rem;\n          --size-9: 0.5625rem;\n          --size-10: 0.625rem;\n          --size-11: 0.6875rem;\n          --size-12: 0.75rem;\n          --size-13: 0.8125rem;\n          --size-14: 0.875rem;\n          --size-15: 0.9375rem;\n          /* If the base font size of the dev overlay changes e.g. 18px, \n          just slide the window and make --size-18 as 1rem. */\n          --size-16: 1rem;\n          --size-17: 1.0625rem;\n          --size-18: 1.125rem;\n          --size-20: 1.25rem;\n          --size-22: 1.375rem;\n          --size-24: 1.5rem;\n          --size-26: 1.625rem;\n          --size-28: 1.75rem;\n          --size-30: 1.875rem;\n          --size-32: 2rem;\n          --size-34: 2.125rem;\n          --size-36: 2.25rem;\n          --size-38: 2.375rem;\n          --size-40: 2.5rem;\n          --size-42: 2.625rem;\n          --size-44: 2.75rem;\n          --size-46: 2.875rem;\n          --size-48: 3rem;\n\n          @media print {\n            display: none;\n          }\n        }\n\n        h1,\n        h2,\n        h3,\n        h4,\n        h5,\n        h6 {\n          margin-bottom: 8px;\n          font-weight: 500;\n          line-height: 1.5;\n        }\n\n        a {\n          color: var(--color-blue-900);\n          &:hover {\n            color: var(--color-blue-900);\n          }\n          &:focus {\n            outline: var(--focus-ring);\n          }\n        }\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function Base() {
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
        children: (0, _css.css)(_templateObject())
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=base.js.map