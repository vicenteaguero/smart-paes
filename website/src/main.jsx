// website/src/main.jsx

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/base.css";
import "./styles/nav.css";
import "./styles/footer.css";
import "./styles/home.css";
import "./styles/ensayos.css";
import "./styles/methodology.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>,
);
