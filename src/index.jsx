import React from "react";
import "./styles/styles.css";
import { createRoot } from "react-dom/client";
import { Bookmarks } from "./bookmarks/index.jsx";
import { ProvideOptions } from "useOptions";
import { ProvideBookmarks } from "useBookmarks";
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
        <Bookmarks />
      </ProvideBookmarks>
    </ProvideOptions>
  </React.StrictMode>
);
