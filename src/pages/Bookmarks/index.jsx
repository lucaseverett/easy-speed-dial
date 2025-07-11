import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import "./styles.css";

import { AboutModal } from "#components/AboutModal";
import { AlertBanner } from "#components/AlertBanner";
import { BookmarkModal } from "#components/BookmarkModal";
import { ContextMenu } from "#components/ContextMenu";
import { Grid } from "#components/Grid";
import { WhatsNewModal } from "#components/WhatsNewModal";
import { bookmarks } from "#stores/useBookmarks";
import { contextMenu } from "#stores/useContextMenu";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";

export const Bookmarks = observer(function Bookmarks() {
  const focusRef = useRef();

  useEffect(() => {
    // Close the context menu and modal when switching folders.
    contextMenu.focusAfterClosed = "";
    modals.focusAfterClosed = "";
    contextMenu.closeContextMenu();
    modals.closeModal();
    // Scroll to the top of the bookmarks list.
    focusRef.current.scrollTop = 0;
    // Move focus to the bookmarks container.
    focusRef.current.focus();
  }, [bookmarks.currentFolder]);

  useEffect(() => {
    // Restore focus to the appropriate element when the modal closes.
    if (!modals.isOpen && modals.focusAfterClosed) {
      let elementToFocus;

      // If modals.focusAfterClosed is a function, call it to get the element to focus.
      // This function is used after editing or creating a bookmark.
      // Otherwise, use the value directly if no changes were made.
      if (typeof modals.focusAfterClosed === "function") {
        elementToFocus = modals.focusAfterClosed();
      } else {
        elementToFocus = modals.focusAfterClosed;
      }

      // Only set focus if the element is present in the DOM.
      // If found, focus the element and reset modals.focusAfterClosed.
      if (document.body.contains(elementToFocus)) {
        elementToFocus.focus();
        modals.focusAfterClosed = "";
      }
    }
    // The bookmarks dependency ensures this effect runs when bookmarks or modal state changes.
    // This is needed to restore focus to the newly created or updated bookmark after the modal closes.
  }, [bookmarks.bookmarks, modals.isOpen]);

  return (
    <>
      {modals.isOpen === "whats-new" && <WhatsNewModal />}
      {modals.isOpen === "about" && <AboutModal />}
      {["new-bookmark", "new-folder", "edit-bookmark", "edit-folder"].includes(
        modals.isOpen,
      ) && <BookmarkModal />}
      {contextMenu.isOpen && <ContextMenu />}
      <div
        className="Bookmarks"
        onClick={contextMenu.closeContextMenu}
        onContextMenu={contextMenu.openContextMenu}
        onScroll={contextMenu.closeContextMenu}
        tabIndex="-1"
        inert={!!modals.isOpen}
        ref={focusRef}
      >
        {settings.showAlertBanner && <AlertBanner />}
        <Grid />
      </div>
    </>
  );
});
