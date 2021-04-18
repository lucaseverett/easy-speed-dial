import { render } from "react-dom";
import { Bookmarks } from "../../bookmarks/index.js";
import { ProvideOptions } from "./useOptions.js";
import { ProvideBookmarks } from "./useBookmarks.js";
import "focus-visible";

// Make <button> focus consistent across browsers
document.querySelector("#app").addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    event.target.focus();
  }
});

render(
  <ProvideOptions>
    <ProvideBookmarks>
      <Bookmarks />
    </ProvideBookmarks>
  </ProvideOptions>,
  document.querySelector("#app")
);
