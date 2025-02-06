// website/src/components/Nav.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (event) => {
      if (
        menuOpen &&
        !event.target.closest(".nav") &&
        !event.target.closest(".hamburger")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <nav className="nav">
      <a href="/">
        <h1 className="nav-title">SmartPAES</h1>
      </a>
      <button
        className="hamburger"
        aria-label="Menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <ul className={menuOpen ? "show" : ""}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/start-ensayo" onClick={() => setMenuOpen(false)}>
            Ensayos
          </Link>
        </li>
        <li>
          <Link to="/methodology" onClick={() => setMenuOpen(false)}>
            Metodología
          </Link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
