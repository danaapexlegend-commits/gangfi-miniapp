// components/NavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

/*
  NavBar: bottom navigation bar with 4 buttons.
  - keep labels/icons simple
  - current route highlighted
  کامنت‌های فارسی برای راهنمایی توسعه‌دهنده
*/

export default function NavBar() {
  const loc = useLocation();
  const active = (path) => (loc.pathname === path ? { fontWeight: "700" } : {});

  const barStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#110d21ff",
    borderTop: "1px solid #8c9cf5ff",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
  };

  return (
    <nav style={barStyle}>
      <Link to="/" style={active("/")}>Home</Link>
      <Link to="/missions" style={active("/missions")}>Missions</Link>
      <Link to="/coming" style={active("/coming")}>Coming</Link>
      <Link to="/info" style={active("/info")}>Info</Link>
    </nav>
  );
}
