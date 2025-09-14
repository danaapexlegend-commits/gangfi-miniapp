// components/MissionAccordion.jsx
import React, { useState } from "react";

/*
  MissionAccordion:
  - header: clickable area shows title and reward
  - on click toggles open/close
  - children is the list of missions inside that section
  - simple UI, stateful
*/

export default function MissionAccordion({ title, rewardLabel, children }) {
  const [open, setOpen] = useState(false);

  const headerStyle = {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "8px 12px",
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    background: "#0a0808ff",
  };

  return (
    <div>
      <div style={headerStyle} onClick={() => setOpen(!open)}>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div>{rewardLabel} {open ? "▲" : "▼"}</div>
      </div>

      {open && <div style={{ padding: "8px 12px" }}>{children}</div>}
    </div>
  );
}
