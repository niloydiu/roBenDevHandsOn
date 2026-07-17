import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AppcontextProvider from "./context/Appcontext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppcontextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AppcontextProvider>
    </BrowserRouter>
  </StrictMode>
);
