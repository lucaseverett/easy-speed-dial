import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import "./NewTab.css";

import { ContextMenu } from "#components/ContextMenu/ContextMenu";
import { Grid } from "#components/Grid/Grid";
import { AboutModal } from "#components/modals/AboutModal/AboutModal";
import { BookmarkModal } from "#components/modals/BookmarkModal/BookmarkModal";
import { ConfirmFaviconPermissionDialog } from "#components/modals/ConfirmFaviconPermissionDialog/ConfirmFaviconPermissionDialog";
import { ConfirmResetDialog } from "#components/modals/ConfirmResetDialog/ConfirmResetDialog";
import { OnboardingModal } from "#components/modals/OnboardingModal/OnboardingModal";
import { PopularSitesModal } from "#components/modals/PopularSitesModal/PopularSitesModal";
import { SettingsModal } from "#components/modals/SettingsModal/SettingsModal";
import { WhatsNewModal } from "#components/modals/WhatsNewModal/WhatsNewModal";
import { focusSafely } from "#lib/focus";
import { bookmarks } from "#stores/bookmarks";
import { contextMenu } from "#stores/contextMenu";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";

export const NewTab = observer(function NewTab() {
  const focusRef = useRef<HTMLDivElement>(null);
  const isConfirmResetOpen = modals.isOpen?.startsWith("confirm-reset");
  const isConfirmFaviconOpen = modals.isOpen === "confirm-favicon-permission";
  // A parent modal (onboarding / settings-panel) renders when it's the
  // active modal *or* when one of its children is on top of it. While a
  // child is open, the parent stays mounted but goes inactive.
  const isOnboardingMounted =
    modals.isOpen === "onboarding" || modals.parentModal === "onboarding";
  const isSettingsMounted =
    modals.isOpen === "settings-panel" ||
    modals.parentModal === "settings-panel";
  const hasChildConfirm = !!modals.parentModal;
  const currentFolderId = bookmarks.currentFolder.id;
  const modalOpen = modals.isOpen;
  const bookmarkIds = bookmarks.bookmarks.map(({ id }) => id).join("|");

  useEffect(() => {
    // Clear menu/modal focus targets when switching folders.
    contextMenu.clearTarget();
    if (modals.isOpen !== "onboarding") {
      modals.focusAfterClosed = null;
      modals.closeModal();
    }
    // Scroll to the top of the bookmarks list and move focus to it.
    if (focusRef.current) {
      focusRef.current.scrollTop = 0;
      focusRef.current.focus();
    }
  }, [currentFolderId]);

  useEffect(() => {
    if (settings.firstRun) {
      modals.openModal({ modal: "onboarding" });
    }
  }, []);

  useEffect(() => {
    // Restore focus to the appropriate element when the modal closes.
    if (!modalOpen && modals.focusAfterClosed) {
      if (focusSafely(modals.focusAfterClosed)) {
        modals.focusAfterClosed = null;
      }
    }
    // The bookmarks dependency ensures this effect runs when bookmarks or modal state changes.
    // This is needed to restore focus to the newly created or updated bookmark after the modal closes.
  }, [bookmarkIds, modalOpen]);

  return (
    <>
      {isOnboardingMounted && <OnboardingModal active={!hasChildConfirm} />}
      {modals.isOpen === "popular-sites" && <PopularSitesModal />}
      {modals.isOpen === "whats-new" && <WhatsNewModal />}
      {modals.isOpen === "about" && <AboutModal />}
      {isSettingsMounted && <SettingsModal active={!hasChildConfirm} />}
      {isConfirmResetOpen && <ConfirmResetDialog />}
      {isConfirmFaviconOpen && <ConfirmFaviconPermissionDialog />}
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
        <Grid />
      </div>
    </>
  );
});
