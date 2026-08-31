import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect, useRef } from "react";

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
import {
  flushScrollPosition,
  getScrollKey,
  readScrollTop,
  saveScrollTop,
} from "#lib/scrollRestore";
import { bookmarks } from "#stores/bookmarks";
import { contextMenu } from "#stores/contextMenu";
import { modals } from "#stores/modals";
import { search } from "#stores/search";
import { settings } from "#stores/settings";

export const NewTab = observer(function NewTab() {
  const focusRef = useRef<HTMLDivElement>(null);
  const isConfirmResetOpen = modals.isOpen?.startsWith("confirm-reset");
  const isConfirmFaviconOpen = modals.isOpen === "confirm-favicon-permission";
  // Keep parent modals mounted beneath their child confirmation dialogs.
  const isOnboardingMounted =
    modals.isOpen === "onboarding" || modals.parentModal === "onboarding";
  const isSettingsMounted =
    modals.isOpen === "settings-panel" ||
    modals.parentModal === "settings-panel";
  const hasChildConfirm = !!modals.parentModal;
  const currentFolderId = bookmarks.currentFolder.id;
  const modalOpen = modals.isOpen;
  const bookmarkIds = bookmarks.bookmarks.map(({ id }) => id).join("|");
  // Each query needs scroll state separate from its folder and other queries.
  const searchViewId = search.isShowingResults
    ? `q:${search.query.trim()}`
    : "folder";
  const itemCount = search.isShowingResults
    ? search.results.length
    : bookmarks.bookmarks.length;
  const scrollKeyRef = useRef("");

  useEffect(() => {
    contextMenu.clearTarget();
    if (modals.isOpen !== "onboarding") {
      modals.focusAfterClosed = null;
      modals.closeModal();
    }
    focusRef.current?.focus();
  }, [currentFolderId]);

  // Restore before paint; itemCount reruns this when async search results arrive.
  useLayoutEffect(() => {
    const container = focusRef.current;
    if (!container || !currentFolderId) return;
    const key = getScrollKey(searchViewId);
    scrollKeyRef.current = key;
    container.scrollTop = readScrollTop(key);
  }, [currentFolderId, searchViewId, itemCount]);

  useEffect(() => {
    // Flush writes that would otherwise be lost when a bookmark unloads the page.
    window.addEventListener("pagehide", flushScrollPosition);
    return () => window.removeEventListener("pagehide", flushScrollPosition);
  }, []);

  useEffect(() => {
    if (settings.firstRun) {
      modals.openModal({ modal: "onboarding" });
    }
  }, []);

  // A bookmark may create the requested focus target after the modal closes.
  useEffect(() => {
    if (!modalOpen && modals.focusAfterClosed) {
      if (focusSafely(modals.focusAfterClosed)) {
        modals.focusAfterClosed = null;
      }
    }
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
        onScroll={(e) => {
          contextMenu.closeContextMenu();
          saveScrollTop(scrollKeyRef.current, e.currentTarget.scrollTop);
        }}
        tabIndex={-1}
        inert={!!modals.isOpen}
        ref={focusRef}
      >
        <Grid />
      </div>
    </>
  );
});
