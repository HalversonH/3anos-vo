import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Anser from 'next/dist/compiled/anser';
import stripAnsi from 'next/dist/compiled/strip-ansi';
import { useMemo } from 'react';
import { HotlinkedText } from '../hot-linked-text';
import { getFrameSource } from '../../../utils/stack-frame';
import { useOpenInEditor } from '../../utils/use-open-in-editor';
import { ExternalIcon } from '../../icons/external';
import { FileIcon } from '../../icons/file';
export function CodeFrame(param) {
    let { stackFrame, codeFrame } = param;
    var _stackFrame_file;
    // Strip leading spaces out of the code frame:
    const formattedFrame = useMemo(()=>{
        const lines = codeFrame.split(/\r?\n/g);
        // Find the minimum length of leading spaces after `|` in the code frame
        const miniLeadingSpacesLength = lines.map((line)=>/^>? +\d+ +\| [ ]+/.exec(stripAnsi(line)) === null ? null : /^>? +\d+ +\| ( *)/.exec(stripAnsi(line))).filter(Boolean).map((v)=>v.pop()).reduce((c, n)=>isNaN(c) ? n.length : Math.min(c, n.length), NaN);
        // When the minimum length of leading spaces is greater than 1, remove them
        // from the code frame to help the indentation looks better when there's a lot leading spaces.
        if (miniLeadingSpacesLength > 1) {
            return lines.map((line, a)=>~(a = line.indexOf('|')) ? line.substring(0, a) + line.substring(a).replace("^\\ {" + miniLeadingSpacesLength + "}", '') : line).join('\n');
        }
        return lines.join('\n');
    }, [
        codeFrame
    ]);
    const decoded = useMemo(()=>{
        return Anser.ansiToJson(formattedFrame, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        formattedFrame
    ]);
    const open = useOpenInEditor({
        file: stackFrame.file,
        lineNumber: stackFrame.lineNumber,
        column: stackFrame.column
    });
    const fileExtension = stackFrame == null ? void 0 : (_stackFrame_file = stackFrame.file) == null ? void 0 : _stackFrame_file.split('.').pop();
    // TODO: make the caret absolute
    return /*#__PURE__*/ _jsxs("div", {
        "data-nextjs-codeframe": true,
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "code-frame-header",
                children: /*#__PURE__*/ _jsxs("p", {
                    className: "code-frame-link",
                    children: [
                        /*#__PURE__*/ _jsx("span", {
                            className: "code-frame-icon",
                            children: /*#__PURE__*/ _jsx(FileIcon, {
                                lang: fileExtension
                            })
                        }),
                        /*#__PURE__*/ _jsxs("span", {
                            "data-text": true,
                            children: [
                                getFrameSource(stackFrame),
                                " @",
                                ' ',
                                /*#__PURE__*/ _jsx(HotlinkedText, {
                                    text: stackFrame.methodName
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("button", {
                            "aria-label": "Open in editor",
                            "data-with-open-in-editor-link-source-file": true,
                            onClick: open,
                            children: /*#__PURE__*/ _jsx("span", {
                                className: "code-frame-icon",
                                "data-icon": "right",
                                children: /*#__PURE__*/ _jsx(ExternalIcon, {
                                    width: 16,
                                    height: 16
                                })
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsx("pre", {
                className: "code-frame-pre",
                children: decoded.map((entry, index)=>/*#__PURE__*/ _jsx("span", {
                        style: {
                            color: entry.fg ? "var(--color-" + entry.fg + ")" : undefined,
                            ...entry.decoration === 'bold' ? // having longer width than expected on Geist Mono font-weight
                            // above 600, hence a temporary fix is to use 500 for bold.
                            {
                                fontWeight: 500
                            } : entry.decoration === 'italic' ? {
                                fontStyle: 'italic'
                            } : undefined
                        },
                        children: entry.content
                    }, "frame-" + index))
            })
        ]
    });
}
export const CODE_FRAME_STYLES = "\n  [data-nextjs-codeframe] {\n    background-color: var(--color-background-200);\n    overflow: hidden;\n    color: var(--color-gray-1000);\n    text-overflow: ellipsis;\n    border: 1px solid var(--color-gray-400);\n    border-radius: 8px;\n    font-family: var(--font-stack-monospace);\n    font-size: var(--size-12);\n    line-height: var(--size-16);\n    margin: 8px 0;\n\n    svg {\n      width: var(--size-16);\n      height: var(--size-16);\n    }\n  }\n\n  .code-frame-link,\n  .code-frame-pre {\n    padding: 12px;\n  }\n\n  .code-frame-link svg {\n    flex-shrink: 0;\n  }\n\n  .code-frame-link [data-text] {\n    display: inline-flex;\n    text-align: left;\n    margin: auto 6px;\n  }\n\n  .code-frame-pre {\n    white-space: pre-wrap;\n  }\n\n  .code-frame-header {\n    width: 100%;\n    transition: background 100ms ease-out;\n    border-radius: 8px 8px 0 0;\n    border-bottom: 1px solid var(--color-gray-400);\n  }\n\n  [data-with-open-in-editor-link-source-file] {\n    padding: 4px;\n    margin: -4px 0 -4px auto;\n    border-radius: var(--rounded-full);\n    margin-left: auto;\n\n    &:focus-visible {\n      outline: var(--focus-ring);\n      outline-offset: -2px;\n    }\n\n    &:hover {\n      background: var(--color-gray-100);\n    }\n  }\n\n  [data-nextjs-codeframe]::selection,\n  [data-nextjs-codeframe] *::selection {\n    background-color: var(--color-ansi-selection);\n  }\n\n  [data-nextjs-codeframe] *:not(a) {\n    color: inherit;\n    background-color: transparent;\n    font-family: var(--font-stack-monospace);\n  }\n\n  [data-nextjs-codeframe] > * {\n    margin: 0;\n  }\n\n  .code-frame-link {\n    display: flex;\n    margin: 0;\n    outline: 0;\n  }\n  .code-frame-link [data-icon='right'] {\n    margin-left: auto;\n  }\n\n  [data-nextjs-codeframe] div > pre {\n    overflow: hidden;\n    display: inline-block;\n  }\n\n  [data-nextjs-codeframe] svg {\n    color: var(--color-gray-900);\n  }\n";

//# sourceMappingURL=code-frame.js.map