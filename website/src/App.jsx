// website/src/App.jsx

import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Ensayos from "./pages/Ensayos";
import Methodology from "./pages/Methodology";
import Saved from "./pages/Saved";
import StartEnsayo from "./pages/StartEnsayo";

function App() {
  return (
    <div className="app-container">
      <Nav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ensayos" element={<Ensayos />} />
          <Route path="/ensayos/saved" element={<Saved />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/start-ensayo" element={<StartEnsayo />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
