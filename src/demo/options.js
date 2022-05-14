import React from "react";
import "../common/styles.css";
import { createRoot } from "react-dom/client";
import { Settings } from "../settings/index.js";
import { ProvideOptions } from "./useOptions.js";
import { ProvideBookmarks } from "./useBookmarks.js";
import "focus-visible";
const root = createRoot(document.querySelector("#app"));

root.render(
  <React.StrictMode>
    <ProvideOptions>
      <ProvideBookmarks>
        <Settings />
      </ProvideBookmarks>
    </ProvideOptions>
  </React.StrictMode>,
  document.querySelector("#app")
);
