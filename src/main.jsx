import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CoinContext } from "./pages/context/CoinContext";
import "./index.css"; // your Tailwind or custom styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <CoinContext>
    <App />
  </CoinContext>
  </React.StrictMode>
);
