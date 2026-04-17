import { createRoot } from "react-dom/client";
import "./index.css";
import "./variables.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import Theme from "../context/ThemeContext.tsx";
import "../i18next/i18next";
import UserContext from "../context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Theme>
      <UserContext>
        <App />
      </UserContext>
    </Theme>
  </BrowserRouter>,
);
