import { autorun } from "mobx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "focus-visible";

import { NewTab } from "#app/NewTab";
import { bookmarks } from "#stores/bookmarks";
import { search, SEARCH_DEBOUNCE_MS } from "#stores/search";
import { settings } from "#stores/settings";

// The URL hash encodes the current folder and, while searching, the active query
// as `#<folderId>&q=<query>`. This lets returning to the page (back / reload)
// restore both the origin folder and the search results, while a fresh tab (no
// hash) stays clean.
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
    // Folder validation and global search are independent browser API calls.
    // Start routing first, then restore search before waiting for it to finish.
    const folderPromise = setFolder(folderId, isCurrentRoute);
    // A query in the hash restores the search; its absence (e.g. navigating into
    // a folder) exits search mode.
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

  // Update folder/search when the URL hash changes (e.g. browser back/forward).
  window.addEventListener("hashchange", applyRoute);

  // Capture the persisted folder/search before anything (the autorun below)
  // can overwrite them. These restore on a fresh same-tab load with no hash,
  // e.g. the browser's Home button, mirroring how `last-folder` already works.
  const { folderId, query } = parseHash();
  const storedFolder = sessionStorage.getItem("last-folder");
  const storedSearch = sessionStorage.getItem("last-search") || "";

  // Reflect the current folder and active query back into the URL hash, and
  // persist the active query to sessionStorage alongside `last-folder`.
  // replaceState avoids polluting history while typing and never fires
  // hashchange, so it won't loop with applyRoute. The scheduler delay batches
  // per-keystroke writes and stays under Firefox's History API rate limiter.
  autorun(
    () => {
      const currentFolderId = bookmarks.currentFolder.id;
      if (!currentFolderId) return;
      const trimmed = search.query.trim();
      const active =
        settings.showSearchBar && search.isActive && trimmed !== "";
      const desired = `#${currentFolderId}${active ? `&q=${encodeURIComponent(trimmed)}` : ""}`;
      if (location.hash !== desired) {
        history.replaceState(null, "", desired);
      }
      if (active) {
        sessionStorage.setItem("last-search", trimmed);
      } else {
        sessionStorage.removeItem("last-search");
      }
    },
    { delay: SEARCH_DEBOUNCE_MS },
  );

  // Select and set the initial folder + query to display. A query in the hash
  // wins; otherwise (no hash, e.g. Home button) fall back to the last search.
  const initialFolder =
    folderId || storedFolder || (settings.defaultFolder as string);
  const initialQuery = query || (folderId ? "" : storedSearch);
  // Start folder validation before restoring search, but do not make the
  // independent bookmark search wait for that validation to finish.
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
