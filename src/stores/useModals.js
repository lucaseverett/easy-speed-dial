import { makeAutoObservable } from "mobx";

export const modals = makeAutoObservable({
  focusAfterClosed: "",
  isOpen: "",
  openModal({ focusAfterClosed, modal }) {
    modals.focusAfterClosed = focusAfterClosed;
    modals.isOpen = modal;
    document.documentElement.classList.add("modal-open");
  },
  closeModal({ focusAfterClosed = "" } = {}) {
    if (!modals.isOpen) return;
    modals.isOpen = "";
    if (focusAfterClosed) {
      modals.focusAfterClosed = focusAfterClosed;
    }
    document.documentElement.classList.remove("modal-open");
  },
});
