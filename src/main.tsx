import React from "react";
import ReactDOM from "react-dom/client";
import { MeshGradient } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MeshGradient animated={true} speed={0.05} />
  </React.StrictMode>
);
