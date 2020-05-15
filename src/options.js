import React from "react";
import { render } from "react-dom";
import "./styles.css";
import { Settings } from "./settings/index.js";
import { ProvideOptions } from "./hooks/useOptions.js";
import { ProvideBookmarks } from "./hooks/useBookmarks.js";
import "focus-visible";

render(
  <ProvideOptions>
    <ProvideBookmarks>
      <Settings />
    </ProvideBookmarks>
  </ProvideOptions>,
  document.querySelector("#app")
);
