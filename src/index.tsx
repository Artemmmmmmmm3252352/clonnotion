import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FigmaDesignPhoto } from "./screens/FigmaDesignPhoto";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <FigmaDesignPhoto />
  </StrictMode>,
);
