import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider
      client={new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!)}
    >
      <App />
    </ConvexProvider>
  </StrictMode>
);
