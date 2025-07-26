import { makeAutoObservable } from "mobx";

export const colorPicker = makeAutoObservable({
  coords: { x: 0, y: 0 },
  isOpen: false,
  focusAfterClosed: "",
  openColorPicker(e) {
    e.preventDefault();
    colorPicker.coords = {
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop + e.currentTarget.offsetHeight + 4,
    };
    colorPicker.focusAfterClosed = e.currentTarget;
    colorPicker.isOpen = true;
  },
  closeColorPicker() {
    if (!colorPicker.isOpen) return;
    colorPicker.isOpen = false;
    colorPicker.focusAfterClosed?.focus();
  },
});
