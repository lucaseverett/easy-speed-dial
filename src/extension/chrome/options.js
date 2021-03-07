import { render } from "react-dom";
import "../../common/styles.css";
import { Settings } from "../../settings/index.js";
import { ProvideOptions } from "./useOptions.js";
import { ProvideBookmarks } from "./useBookmarks.js";
import "focus-visible";

render(
  <ProvideOptions>
    <ProvideBookmarks>
      <Settings />
    </ProvideBookmarks>
  </ProvideOptions>,
  document.querySelector("#app")
);
