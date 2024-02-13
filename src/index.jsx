import React from "react";
import { createRoot } from "react-dom/client";

import { bookmarks } from "#stores/useBookmarks";
import { settings } from "#stores/useSettings";
import { Bookmarks } from "./Bookmarks/index";

const session = sessionStorage.getItem("last-folder");
if (!location.hash && session && session !== settings.defaultFolder) {
  // Load from session when clicking browser home button.
  history.replaceState(null, null, `#${session}`);
  bookmarks.changeFolder(session);
} else if (location.hash) {
  // Load from hash when reloading page.
  bookmarks.changeFolder(location.hash.slice(1));
} else {
  // Load default folder on first load.
  history.replaceState(null, null, `#${settings.defaultFolder}`);
  bookmarks.changeFolder(settings.defaultFolder);
}

// Change folder when hash changes. (Browser back/forward buttons.)
window.addEventListener("hashchange", () => {
  bookmarks.changeFolder(location.hash.slice(1));
});

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <Bookmarks />
  </React.StrictMode>,
);
