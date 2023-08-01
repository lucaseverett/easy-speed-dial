import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/styles.css";
import { Bookmarks } from "./bookmarks/index.jsx";
import { ProvideOptions } from "useOptions";
import { ProvideBookmarks } from "useBookmarks";
import { ProvideContextMenu } from "./bookmarks/useContextMenu.jsx";
import { ProvideModals } from "./bookmarks/useModals.jsx";

const root = createRoot(document.querySelector("#app"));

// Make <button> focus consistent across browsers
document.querySelector("#app").addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    event.target.focus();
  }
});

root.render(
  <React.StrictMode>
    <ProvideOptions>
      <ProvideBookmarks>
        <ProvideModals>
          <ProvideContextMenu>
            <Bookmarks />
          </ProvideContextMenu>
        </ProvideModals>
      </ProvideBookmarks>
    </ProvideOptions>
  </React.StrictMode>,
);
