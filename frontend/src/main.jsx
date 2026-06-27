import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/style.css";
import "./styles/filters.css";
import "./styles/show.css";
import "./styles/rating.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FlashProvider } from "./context/FlashContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FlashProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FlashProvider>
  </React.StrictMode>
);
