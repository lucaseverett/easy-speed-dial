import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Settings } from "#pages/Settings";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <StrictMode>
    <Settings />
  </StrictMode>,
);
