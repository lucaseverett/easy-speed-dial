import React from "react";
import { createRoot } from "react-dom/client";

import { Settings } from "./Settings/index";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
);
