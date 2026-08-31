import { autorun } from "mobx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "focus-visible";

import { NewTab } from "#app/NewTab";
import { bookmarks } from "#stores/bookmarks";
import { search, SEARCH_DEBOUNCE_MS } from "#stores/search";
import { settings } from "#stores/settings";

// Preserve folder and search state across reloads as `#<folderId>&q=<query>`.
function parseHash() {
  const raw = location.hash.slice(1);
  const separator = raw.indexOf("&");
  const folderId = separator === -1 ? raw : raw.slice(0, separator);
  const query =
    separator === -1
      ? ""
      : new URLSearchParams(raw.slice(separator + 1)).get("q") || "";
  return { folderId, query };
}

async function initializeApp() {
  let routeSeq = 0;

  const setFolder = async (
    folderId: string | null,
    shouldCommit: () => boolean,
  ) => {
    const isValid = folderId
      ? await bookmarks.validateFolderExists(folderId)
      : false;
    const targetId = isValid ? folderId! : await bookmarks.getBookmarksBarId();
    if (!shouldCommit()) return;
    await bookmarks.changeFolder(targetId, shouldCommit);
  };

  const applyRoute = async () => {
    const currentRoute = ++routeSeq;
    const isCurrentRoute = () => currentRoute === routeSeq;
    const { folderId, query } = parseHash();
    // Start independent folder and search requests together.
    const folderPromise = setFolder(folderId, isCurrentRoute);
    if (query && settings.showSearchBar) {
      search.restoreQuery(query);
      await folderPromise;
      return;
    }

    // Keep the current search results visible until the destination folder is
    // ready, then switch directly to it without flashing the previous folder.
    await folderPromise;
    if (!isCurrentRoute()) return;
    search.clear();
  };

  window.addEventListener("hashchange", applyRoute);

  // The app restores its nested scroller; browser restoration would compete.
  history.scrollRestoration = "manual";

  // Read persisted state before the autorun below can overwrite it.
  const { folderId, query } = parseHash();
  const storedFolder = sessionStorage.getItem("last-folder");
  const storedSearch = sessionStorage.getItem("last-search") || "";

  // replaceState avoids history entries and hashchange loops. Delaying the
  // autorun also keeps typing below Firefox's History API rate limit.
  autorun(
    () => {
      const currentFolderId = bookmarks.currentFolder.id;
      if (!currentFolderId) return;
      const trimmed = search.query.trim();
      const active =
        settings.showSearchBar && search.isActive && trimmed !== "";
      const desired = `#${currentFolderId}${active ? `&q=${encodeURIComponent(trimmed)}` : ""}`;
      if (location.hash !== desired) {
        // Carry the existing state across: it holds the entry's scroll key.
        history.replaceState(history.state, "", desired);
      }
      if (active) {
        sessionStorage.setItem("last-search", trimmed);
      } else {
        sessionStorage.removeItem("last-search");
      }
    },
    { delay: SEARCH_DEBOUNCE_MS },
  );

  const initialFolder =
    folderId || storedFolder || (settings.defaultFolder as string);
  const initialQuery = query || (folderId ? "" : storedSearch);
  // Start independent folder and search requests together.
  const initialRoute = ++routeSeq;
  const isCurrentRoute = () => initialRoute === routeSeq;
  const folderPromise = setFolder(initialFolder, isCurrentRoute);
  if (initialQuery && settings.showSearchBar) {
    search.restoreQuery(initialQuery);
  }
  await folderPromise;
}

initializeApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NewTab />
  </StrictMode>,
);
