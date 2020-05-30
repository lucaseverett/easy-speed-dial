import React from "react";
import { render } from "react-dom";
import "../../common/styles.css";
import { Bookmarks } from "../../bookmarks/index.js";
import { ProvideOptions } from "./useOptions.js";
import { ProvideBookmarks } from "./useBookmarks.js";
import "focus-visible";

render(
  <ProvideOptions>
    <ProvideBookmarks>
      <Bookmarks />
    </ProvideBookmarks>
  </ProvideOptions>,
  document.querySelector("#app")
);
