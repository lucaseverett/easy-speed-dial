import { makeAutoObservable } from "mobx";

export const modals = makeAutoObservable({
  focusAfterClosed: "",
  isOpen: "",
  editingBookmarkId: null, // Holds the ID of the bookmark currently being edited
  openModal({ focusAfterClosed, modal, editingBookmarkId = null }) {
    modals.focusAfterClosed = focusAfterClosed;
    modals.isOpen = modal;
    modals.editingBookmarkId = editingBookmarkId;
    document.documentElement.classList.add("modal-open");
  },
  closeModal({ focusAfterClosed = "" } = {}) {
    if (!modals.isOpen) return;
    modals.isOpen = null;
    modals.editingBookmarkId = null;
    if (focusAfterClosed) {
      modals.focusAfterClosed = focusAfterClosed;
    }
    document.documentElement.classList.remove("modal-open");
  },
});
