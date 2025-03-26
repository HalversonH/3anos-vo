import { useEffect } from 'react';
export function useFocusTrap(rootRef, triggerRef, active, onOpenFocus) {
    useEffect(()=>{
        let rootNode = null;
        function onTab(e) {
            if (e.key !== 'Tab' || rootNode === null) {
                return;
            }
            const [firstFocusableNode, lastFocusableNode] = getFocusableNodes(rootNode);
            const activeElement = getActiveElement(rootNode);
            if (e.shiftKey) {
                if (activeElement === firstFocusableNode) {
                    lastFocusableNode == null ? void 0 : lastFocusableNode.focus();
                    e.preventDefault();
                }
            } else {
                if (activeElement === lastFocusableNode) {
                    firstFocusableNode == null ? void 0 : firstFocusableNode.focus();
                    e.preventDefault();
                }
            }
        }
        const id = setTimeout(()=>{
            // Grab this on next tick to ensure the content is mounted
            rootNode = rootRef.current;
            if (active) {
                if (onOpenFocus) {
                    onOpenFocus();
                } else {
                    rootNode == null ? void 0 : rootNode.focus();
                }
                rootNode == null ? void 0 : rootNode.addEventListener('keydown', onTab);
            } else {
                const activeElement = getActiveElement(rootNode);
                // Only restore focus if the focus was previously on the content.
                // This avoids us accidentally focusing on mount when the
                // user could want to interact with their own app instead.
                if (triggerRef && (rootNode == null ? void 0 : rootNode.contains(activeElement))) {
                    var _triggerRef_current;
                    (_triggerRef_current = triggerRef.current) == null ? void 0 : _triggerRef_current.focus();
                }
            }
        });
        return ()=>{
            clearTimeout(id);
            rootNode == null ? void 0 : rootNode.removeEventListener('keydown', onTab);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        active
    ]);
}
function getActiveElement(node) {
    const root = node == null ? void 0 : node.getRootNode();
    return root instanceof ShadowRoot ? root == null ? void 0 : root.activeElement : null;
}
function getFocusableNodes(node) {
    const focusableElements = node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusableElements) return [];
    return [
        focusableElements[0],
        focusableElements[focusableElements.length - 1]
    ];
}
//////////////////////////////////////////////////////////////////////////////////////
export function useClickOutside(rootRef, triggerRef, active, close) {
    useEffect(()=>{
        if (!active) {
            return;
        }
        function handleClickOutside(event) {
            var _rootRef_current, _triggerRef_current;
            if (!(((_rootRef_current = rootRef.current) == null ? void 0 : _rootRef_current.getBoundingClientRect()) ? event.clientX >= rootRef.current.getBoundingClientRect().left && event.clientX <= rootRef.current.getBoundingClientRect().right && event.clientY >= rootRef.current.getBoundingClientRect().top && event.clientY <= rootRef.current.getBoundingClientRect().bottom : false) && !(((_triggerRef_current = triggerRef.current) == null ? void 0 : _triggerRef_current.getBoundingClientRect()) ? event.clientX >= triggerRef.current.getBoundingClientRect().left && event.clientX <= triggerRef.current.getBoundingClientRect().right && event.clientY >= triggerRef.current.getBoundingClientRect().top && event.clientY <= triggerRef.current.getBoundingClientRect().bottom : false)) {
                close();
            }
        }
        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                close();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        active
    ]);
}
//////////////////////////////////////////////////////////////////////////////////////
export const MENU_DURATION_MS = 200;
export const MENU_CURVE = 'cubic-bezier(0.175, 0.885, 0.32, 1.1)';

//# sourceMappingURL=utils.js.map