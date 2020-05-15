import React from "react";
import { render } from "react-dom";
import "./styles.css";
import { Bookmarks } from "./bookmarks/index.js";
import { ProvideOptions } from "./hooks/useOptions.js";
import { ProvideBookmarks } from "./hooks/useBookmarks.js";
import "focus-visible";

render(
  <ProvideOptions>
    <ProvideBookmarks>
      <Bookmarks />
    </ProvideBookmarks>
  </ProvideOptions>,
  document.querySelector("#app")
);
