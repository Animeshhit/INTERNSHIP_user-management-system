import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import ReduxProvider from "./store/Provider.tsx";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider>
    <Router>
      <App />
    </Router>
  </ReduxProvider>
);
