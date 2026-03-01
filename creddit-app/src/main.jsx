/*
 * File:        main.jsx
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Entry point that mounts the App component into the DOM.
 */

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
