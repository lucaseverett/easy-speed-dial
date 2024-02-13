import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import "./styles.css";

import { bookmarks } from "#stores/useBookmarks";
import { contextMenu } from "#stores/useContextMenu";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";
import { AboutModal } from "./AboutModal";
import { AlertBanner } from "./AlertBanner";
import { BookmarkModal } from "./BookmarkModal";
import { ContextMenu } from "./ContextMenu";
import { Grid } from "./Grid";
import { WhatsNewModal } from "./WhatsNewModal";

export const Bookmarks = observer(function Bookmarks() {
  const focusRef = useRef();

  useEffect(() => {
    // When changing folders, close context menu and modal.
    contextMenu.focusAfterClosed = "";
    modals.focusAfterClosed = "";
    contextMenu.closeContextMenu();
    modals.closeModal();
    // Scroll to top of page.
    focusRef.current.scrollTop = 0;
    // Set focus to bookmarks div.
    focusRef.current.focus();
  }, [bookmarks.currentFolder]);

  useEffect(() => {
    // Restore focus when bookmark modal is closed.
    if (!modals.isOpen && modals.focusAfterClosed) {
      let elementToFocus;

      // Check if modals.focusAfterClosed is a function and execute it if so.
      // A function is used when editing or creating a bookmark.
      // The other version is used when closing the modal with no changes.
      if (typeof modals.focusAfterClosed === "function") {
        elementToFocus = modals.focusAfterClosed();
      } else {
        elementToFocus = modals.focusAfterClosed;
      }

      // Check if the element exists in the DOM.
      // If it does, set focus to it and clear modals.focusAfterClosed.
      if (document.body.contains(elementToFocus)) {
        elementToFocus.focus();
        modals.focusAfterClosed = "";
      }
    }
    // Bookmarks dependency is needed for web extension.
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
        inert={modals.isOpen ? "" : undefined}
        ref={focusRef}
      >
        {settings.showAlertBanner && <AlertBanner />}
        <Grid />
      </div>
    </>
  );
});
