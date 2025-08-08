import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import "./styles.css";

import { AboutModal } from "#components/AboutModal";
import { AlertBanner } from "#components/AlertBanner";
import { BookmarkModal } from "#components/BookmarkModal";
import { ContextMenu } from "#components/ContextMenu";
import { Grid } from "#components/Grid";
import { SettingsModal } from "#components/SettingsModal";
import { WhatsNewModal } from "#components/WhatsNewModal";
import { bookmarks } from "#stores/useBookmarks";
import { contextMenu } from "#stores/useContextMenu";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";
import { focusSafely } from "#utils/focus";

export const Bookmarks = observer(function Bookmarks() {
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close the context menu and modal when switching folders.
    contextMenu.focusAfterClosed = null;
    modals.focusAfterClosed = null;
    contextMenu.closeContextMenu();
    modals.closeModal();
    // Scroll to the top of the bookmarks list.
    if (focusRef.current) {
      focusRef.current.scrollTop = 0;
      // Move focus to the bookmarks container.
      focusRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks.currentFolder]);

  useEffect(() => {
    // Restore focus to the appropriate element when the modal closes.
    if (!modals.isOpen && modals.focusAfterClosed) {
      if (focusSafely(modals.focusAfterClosed)) {
        modals.focusAfterClosed = null;
      }
    }
    // The bookmarks dependency ensures this effect runs when bookmarks or modal state changes.
    // This is needed to restore focus to the newly created or updated bookmark after the modal closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks.bookmarks, modals.isOpen]);

  return (
    <>
      {modals.isOpen === "whats-new" && <WhatsNewModal />}
      {modals.isOpen === "about" && <AboutModal />}
      {modals.isOpen === "settings-panel" && <SettingsModal />}
      {modals.isOpen &&
        ["new-bookmark", "new-folder", "edit-bookmark", "edit-folder"].includes(
          modals.isOpen,
        ) && <BookmarkModal />}
      {contextMenu.isOpen && <ContextMenu />}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="Bookmarks"
        onClick={() => contextMenu.closeContextMenu()}
        onContextMenu={contextMenu.openContextMenu}
        onScroll={() => contextMenu.closeContextMenu()}
        tabIndex={-1}
        inert={!!modals.isOpen}
        ref={focusRef}
      >
        {settings.showAlertBanner && <AlertBanner />}
        <Grid />
      </div>
    </>
  );
});
