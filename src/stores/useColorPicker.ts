import type { MouseEvent } from "react";

import { makeAutoObservable } from "mobx";

export const colorPicker = makeAutoObservable({
  coords: { x: 0, y: 0 },
  isOpen: false,
  focusAfterClosed: null as HTMLElement | null,
  openColorPicker(e: MouseEvent) {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    colorPicker.coords = {
      x: target.offsetLeft,
      y: target.offsetTop + target.offsetHeight + 4,
    };
    colorPicker.focusAfterClosed = target;
    colorPicker.isOpen = true;
  },
  closeColorPicker() {
    if (!colorPicker.isOpen) return;
    colorPicker.isOpen = false;
    colorPicker.focusAfterClosed?.focus();
  },
});
