import React from "react";
import { createRoot } from "react-dom/client";

import { bookmarks } from "#stores/useBookmarks";
import { settings } from "#stores/useSettings";
import { Bookmarks } from "./Bookmarks/index";

async function initializeApp() {
  const setFolder = async (folderId) => {
    const isValid = folderId
      ? await bookmarks.validateFolderExists(folderId)
      : false;
    const targetId = isValid ? folderId : await bookmarks.getBookmarksBarId();

    bookmarks.changeFolder(targetId);
    // Update hash if it's incorrect or was missing.
    if (location.hash.slice(1) !== targetId) {
      history.replaceState(null, null, `#${targetId}`);
    }
  };

  // Change folder when hash changes. (Browser back/forward buttons.)
  window.addEventListener("hashchange", () => {
    setFolder(location.hash.slice(1));
  });

  // Determine and set the initial folder.
  const initialFolder =
    location.hash.slice(1) ||
    sessionStorage.getItem("last-folder") ||
    settings.defaultFolder;
  await setFolder(initialFolder);
}

initializeApp();

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <Bookmarks />
  </React.StrictMode>,
);
