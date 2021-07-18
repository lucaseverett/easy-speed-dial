import React from "react";
import { render } from "react-dom";
import { ProvideOptions } from "./useOptions.js";
import { ProvideBookmarks } from "./useBookmarks.js";
import App from "./App.js";
import "focus-visible";

// Make <button> focus consistent across browsers
document.querySelector("#app").addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    event.target.focus();
  }
});

render(
  <React.StrictMode>
    <ProvideOptions>
      <ProvideBookmarks>
        <App />
      </ProvideBookmarks>
    </ProvideOptions>
  </React.StrictMode>,
  document.querySelector("#app")
);
