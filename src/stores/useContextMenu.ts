import type { MouseEvent } from "react";

import { makeAutoObservable } from "mobx";

import { focusSafely } from "#utils/focus";

export const contextMenu = makeAutoObservable({
  coords: { x: 0, y: 0 },
  focusAfterClosed: null as HTMLElement | null,
  isOpen: false,
  openContextMenu(e: MouseEvent) {
    if (e.shiftKey) return; // Shift + right click opens browser context menu.
    e.preventDefault();
    e.stopPropagation();
    // Derive coordinates. If invoked via keyboard (Context Menu key), pageX/Y may be 0.
    if (e.pageX === 0 && e.pageY === 0) {
      const anchor =
        (e.target as HTMLElement | null) ??
        (document.activeElement as HTMLElement | null);
      const rect = anchor?.getBoundingClientRect();
      contextMenu.coords = rect
        ? {
            x: Math.round(rect.left + rect.width / 2 + window.scrollX),
            y: Math.round(rect.top + rect.height / 2 + window.scrollY),
          }
        : { x: 0, y: 0 };
    } else {
      contextMenu.coords = { x: e.pageX, y: e.pageY };
    }
    contextMenu.focusAfterClosed = e.currentTarget as HTMLElement;
    contextMenu.isOpen = true;
  },
  closeContextMenu({ focusAfterClosed = true } = {}) {
    if (!contextMenu.isOpen) return;
    contextMenu.isOpen = false;
    if (focusAfterClosed) {
      focusSafely(contextMenu.focusAfterClosed);
    }
  },
});
