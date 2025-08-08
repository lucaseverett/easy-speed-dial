import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Bookmarks } from "#pages/Bookmarks";
import { bookmarks } from "#stores/useBookmarks";
import { settings } from "#stores/useSettings";

async function initializeApp() {
  const setFolder = async (folderId: string | null) => {
    const isValid = folderId
      ? await bookmarks.validateFolderExists(folderId)
      : false;
    const targetId = isValid ? folderId! : await bookmarks.getBookmarksBarId();

    bookmarks.changeFolder(targetId);
    // Update the URL hash if it is missing or incorrect.
    if (location.hash.slice(1) !== targetId) {
      history.replaceState(null, "", `#${targetId}`);
    }
  };

  // Switch folders when the URL hash changes (e.g., when using browser navigation buttons).
  window.addEventListener("hashchange", () => {
    setFolder(location.hash.slice(1));
  });

  // Select and set the initial folder to display.
  const initialFolder =
    location.hash.slice(1) ||
    sessionStorage.getItem("last-folder") ||
    (settings.defaultFolder as string);
  await setFolder(initialFolder);
}

initializeApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bookmarks />
  </StrictMode>,
);
