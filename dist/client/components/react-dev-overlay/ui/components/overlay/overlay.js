"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Overlay", {
    enumerable: true,
    get: function() {
        return Overlay;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _jsxruntime = require("react/jsx-runtime");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _bodylocker = require("./body-locker");
const Overlay = function Overlay(param) {
    let { className, children, fixed, ...props } = param;
    _react.useEffect(()=>{
        (0, _bodylocker.lock)();
        return ()=>{
            (0, _bodylocker.unlock)();
        };
    }, []);
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)("div", {
        "data-nextjs-dialog-overlay": true,
        className: className,
        ...props,
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                "data-nextjs-dialog-backdrop": true,
                "data-nextjs-dialog-backdrop-fixed": fixed ? true : undefined
            }),
            children
        ]
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=overlay.js.map