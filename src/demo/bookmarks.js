import React from "react";
import { createRoot } from "react-dom/client";
import { ProvideOptions } from "./useOptions.js";
import { ProvideBookmarks } from "./useBookmarks.js";
import App from "./App.js";
import "focus-visible";
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
        <App />
      </ProvideBookmarks>
    </ProvideOptions>
  </React.StrictMode>
);
