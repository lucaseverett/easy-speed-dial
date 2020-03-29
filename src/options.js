import React from "react";
import { render } from "react-dom";
import "./styles.css";
import { Settings } from "./settings/index.js";
import { ProvideOptions } from "./hooks/useOptions.js";

render(
  <ProvideOptions>
    <Settings />
  </ProvideOptions>,
  document.querySelector("#app")
);
