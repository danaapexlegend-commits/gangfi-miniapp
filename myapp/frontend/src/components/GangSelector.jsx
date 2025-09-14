// components/GangSelector.jsx
import React from "react";
import InfoButton from "./InfoButton";

/*
  GangSelector:
  - shows 4 gangs
  - lets user pick one
  - props:
    selectedGang -> current gang object or null
    onSelect -> function to call when user picks a gang
*/

export default function GangSelector({ selectedGang, onSelect }) {
  const gangs = [
    { id: 1, name: "Gang Alpha", logo: "🔥" },
    { id: 2, name: "Gang Beta", logo: "⚡" },
    { id: 3, name: "Gang Gamma", logo: "💀" },
    { id: 4, name: "Gang Delta", logo: "🐍" },
  ];

  if (selectedGang) {
    return (
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <h3>Your gang:</h3>
        <div style={{ fontSize: 40, marginTop: 10 }}>{selectedGang.logo}</div>
        <p style={{ marginTop: 8, fontWeight: 600 }}>{selectedGang.name}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Select your gang</h3>
      {gangs.map((g) => (
        <InfoButton key={g.id} text={g.name} onClick={() => onSelect(g)} />
      ))}
    </div>
  );
}
