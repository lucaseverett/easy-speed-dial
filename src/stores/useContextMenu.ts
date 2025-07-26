import { makeAutoObservable } from "mobx";

export const contextMenu = makeAutoObservable({
  coords: { x: 0, y: 0 },
  focusAfterClosed: "",
  isOpen: false,
  openContextMenu(e) {
    if (e.shiftKey) return; // Shift + right click opens browser context menu.
    e.preventDefault();
    e.stopPropagation();
    contextMenu.coords = { x: e.pageX, y: e.pageY };
    contextMenu.focusAfterClosed = e.currentTarget;
    contextMenu.isOpen = true;
  },
  closeContextMenu({ focusAfterClosed = true } = {}) {
    if (!contextMenu.isOpen) return;
    contextMenu.isOpen = false;
    if (focusAfterClosed) {
      contextMenu.focusAfterClosed?.focus();
    }
  },
});
