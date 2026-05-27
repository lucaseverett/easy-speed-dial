import type { FocusTarget } from "#lib/focus";

import { makeAutoObservable } from "mobx";

import { focusByDataId, targetFromEvent } from "#lib/focus";

// Modals that stack on top of a parent modal and return focus to it on close,
// instead of fully unmounting the modal stack. Listed explicitly so we don't
// rely on naming conventions like `startsWith("confirm-")` — adding a new
// `confirm-*` modal that isn't a child would otherwise break parent tracking.
const CHILD_MODALS = new Set([
  "confirm-reset",
  "confirm-reset-dial-customizations",
  "confirm-favicon-permission",
]);

const PARENT_MODALS = new Set(["settings-panel", "onboarding"]);

interface ModalStore {
  focusAfterClosed: FocusTarget;
  focusAfterOpened: FocusTarget;
  parentFocusAfterClosed: FocusTarget;
  parentModal: string | null;
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
  focusAfterOpened: null,
  parentFocusAfterClosed: null,
  parentModal: null,
  isOpen: null,
  editingBookmarkId: null, // Holds the ID of the bookmark currently being edited
  openModal({ focusAfterClosed, modal, editingBookmarkId = null }) {
    if (
      modals.isOpen &&
      PARENT_MODALS.has(modals.isOpen) &&
      CHILD_MODALS.has(modal)
    ) {
      modals.parentModal = modals.isOpen;
      modals.parentFocusAfterClosed = modals.focusAfterClosed;
    } else {
      modals.parentModal = null;
      modals.parentFocusAfterClosed = null;
    }
    modals.focusAfterClosed = focusAfterClosed ?? null;
    modals.isOpen = modal;
    modals.editingBookmarkId = editingBookmarkId;
    document.documentElement.classList.add("modal-open");
  },
  closeModal({ focusAfterClosed = null } = {}) {
    if (!modals.isOpen) return;
    const nextFocus = focusAfterClosed || modals.focusAfterClosed;
    const shouldReturnToParentModal =
      !!modals.parentModal && CHILD_MODALS.has(modals.isOpen);

    if (shouldReturnToParentModal) {
      const parentFocusAfterClosed = modals.parentFocusAfterClosed;
      const parentModal = modals.parentModal;
      modals.isOpen = parentModal;
      modals.editingBookmarkId = null;
      modals.parentModal = null;
      modals.parentFocusAfterClosed = null;
      modals.focusAfterOpened = nextFocus;
      modals.focusAfterClosed = parentFocusAfterClosed;
      return;
    }

    modals.isOpen = null;
    modals.editingBookmarkId = null;
    modals.focusAfterOpened = null;
    modals.parentModal = null;
    modals.parentFocusAfterClosed = null;
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
