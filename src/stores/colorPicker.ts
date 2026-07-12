import type { MouseEvent } from "react";

import { makeAutoObservable } from "mobx";

export const colorPicker = makeAutoObservable({
  anchor: null as HTMLElement | null,
  isOpen: false,
  focusAfterClosed: null as HTMLElement | null,
  openColorPicker(e: MouseEvent) {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    colorPicker.anchor = target;
    colorPicker.focusAfterClosed = target;
    colorPicker.isOpen = true;
  },
  closeColorPicker({ restoreFocus = true } = {}) {
    if (!colorPicker.isOpen) return;
    colorPicker.isOpen = false;
    colorPicker.anchor = null;
    if (restoreFocus) {
      colorPicker.focusAfterClosed?.focus();
    }
    colorPicker.focusAfterClosed = null;
  },
});
