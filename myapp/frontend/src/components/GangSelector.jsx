// frontend/src/components/GangSelector.jsx
import React from "react";

const gangs = [
  { id: "lion", name: "Lion", emoji: "🦁" },
  { id: "wolf", name: "Wolf", emoji: "🐺" },
  { id: "eagle", name: "Eagle", emoji: "🦅" },
  { id: "shark", name: "Shark", emoji: "🦈" },
];

export default function GangSelector({ selectedGang, onSelect }) {
  if (selectedGang) {
    const gang = gangs.find((g) => g.id === selectedGang);
    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div style={{ fontSize: 50 }}>{gang ? gang.emoji : "⭐"}</div>
        <p>
          You are in <b>{gang ? gang.name : "Unknown"}</b> gang
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20 }}>
      <p>Select your gang:</p>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {gangs.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            style={{
              fontSize: 30,
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            {g.emoji} {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
