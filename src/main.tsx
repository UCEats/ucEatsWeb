import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexProvider
        client={new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!)}
      >
        <App />
      </ConvexProvider>
    </BrowserRouter>
  </StrictMode>
);
