import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./UI/styles/main.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
