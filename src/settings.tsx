import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "focus-visible";

import { Settings } from "#app/Settings";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Settings />
  </StrictMode>,
);
