import React from "react";

import "./styles/styles.css";
import { createRoot } from "react-dom/client";
import { Settings } from "./settings/index.jsx";
import { ProvideOptions } from "useOptions";
import { ProvideBookmarks } from "useBookmarks";

const root = createRoot(document.querySelector("#app"));

root.render(
  <React.StrictMode>
    <ProvideOptions>
      <ProvideBookmarks>
        <Settings />
      </ProvideBookmarks>
    </ProvideOptions>
  </React.StrictMode>,
);
