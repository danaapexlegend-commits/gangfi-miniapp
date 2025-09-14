// components/InfoButton.jsx
import React from "react";

/*
  Reusable button component for Info page (and others)
  Props:
   - text: string -> button text
   - onClick: function -> action when clicked
*/

export default function InfoButton({ text, onClick }) {
  const baseStyle = {
    display: "block",
    width: "100%",
    marginBottom: 12,
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#000000ff",   // white background
    color: "#ffffffff",        // dark text
    cursor: "pointer",
    textAlign: "left",
    fontSize: 16,
    fontWeight: 500,
    transition: "background 0.2s",
  };

  return (
    <button
      style={baseStyle}
      onClick={onClick}
      onMouseOver={(e) => (e.currentTarget.style.background = "#4c4646ff")}
      onMouseOut={(e) => (e.currentTarget.style.background = "#000000ff")}
    >
      {text}
    </button>
  );
}
