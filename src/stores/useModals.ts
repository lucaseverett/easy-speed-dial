import type { FocusTarget } from "#utils/focus";

import { makeAutoObservable } from "mobx";

import { focusByDataId, targetFromEvent } from "#utils/focus";

interface ModalStore {
  focusAfterClosed: FocusTarget;
  isOpen: string | null;
  editingBookmarkId: string | null;
  openModal(params: {
    focusAfterClosed?: FocusTarget;
    modal: string;
    editingBookmarkId?: string | null;
  }): void;
  closeModal({ focusAfterClosed }?: { focusAfterClosed?: FocusTarget }): void;
  setFocusFromEvent(e: Event | { currentTarget?: EventTarget | null }): void;
  setFocusById(id: string): void;
}

export const modals: ModalStore = makeAutoObservable({
  focusAfterClosed: null,
  isOpen: null,
  editingBookmarkId: null, // Holds the ID of the bookmark currently being edited
  openModal({ focusAfterClosed, modal, editingBookmarkId = null }) {
    modals.focusAfterClosed = focusAfterClosed ?? null;
    modals.isOpen = modal;
    modals.editingBookmarkId = editingBookmarkId;
    document.documentElement.classList.add("modal-open");
  },
  closeModal({ focusAfterClosed = null } = {}) {
    if (!modals.isOpen) return;
    modals.isOpen = null;
    modals.editingBookmarkId = null;
    if (focusAfterClosed) {
      modals.focusAfterClosed = focusAfterClosed;
    }
    document.documentElement.classList.remove("modal-open");
  },
  setFocusFromEvent(e) {
    // Store the element that triggered the action so focus can be restored later
    modals.focusAfterClosed = targetFromEvent(e);
  },
  setFocusById(id) {
    // Defer finding the element until after modal close and DOM updates
    modals.focusAfterClosed = focusByDataId(id);
  },
});
