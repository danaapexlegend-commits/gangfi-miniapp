import React, { useState, useEffect } from "react";
import InfoButton from "../components/InfoButton";
import client from "../api/client";

export default function Missions() {
  const [openSection, setOpenSection] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    async function loadMissions() {
      try {
        const all = await client.get("/missions");
        const missions = all.data || {};

        // 🔹 چون بک‌اند object می‌ده { weekly:[], seasonal:[] }
        setWeekly(missions.weekly || []);
        setSeasonal(missions.seasonal || []);

        const c = await client.get("/missions/completed");
        setCompleted(c.data?.missions || []);
      } catch (e) {
        console.error("Failed to load missions", e);
      }
    }
    loadMissions();
  }, []);

  const handleGo = async (mission, section) => {
    if (mission.missionLink) {
      window.open(mission.missionLink, "_blank");
    } else {
      alert("No link provided for this mission.");
    }

    try {
      await client.post(`/missions/${mission.id}/start`, { userId: 1 }); // 👈 بتا

      // 🔹 بعد از کلیک روی Go وضعیت لوکال رو pending می‌کنیم
      if (section === "weekly") {
        setWeekly((prev) =>
          prev.map((m) =>
            m.id === mission.id ? { ...m, status: "pending" } : m
          )
        );
      }
      if (section === "seasonal") {
        setSeasonal((prev) =>
          prev.map((m) =>
            m.id === mission.id ? { ...m, status: "pending" } : m
          )
        );
      }
    } catch (e) {
      console.error("Failed to set mission pending", e);
    }
  };

  const renderList = (missions, section, isCompleted = false) => (
    <div style={{ marginTop: 10 }}>
      {(!missions || missions.length === 0) ? (
        <p style={{ fontSize: 12, color: "#aaa" }}>No missions available</p>
      ) : (
        missions.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 10px",
              background: "#222",
              borderRadius: "8px",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: 14 }}>{m.description}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: 12, color: "gold" }}>
                +{m.reward_points}
              </span>
              {!isCompleted && (
                <button
                  onClick={() => handleGo(m, section)}
                  style={{
                    background: m.status === "pending" ? "#aaa" : "#4F46E5",
                    color: "white",
                    borderRadius: "6px",
                    padding: "4px 10px",
                  }}
                >
                  {m.status === "pending" ? "Pending" : "Go"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      {/* Daily */}
      <InfoButton
        text="Daily Missions"
        onClick={() => setOpenSection(openSection === "daily" ? null : "daily")}
      />
      {openSection === "daily" && renderList([], "daily")}

      {/* Weekly */}
      <InfoButton
        text="Weekly Missions"
        onClick={() =>
          setOpenSection(openSection === "weekly" ? null : "weekly")
        }
      />
      {openSection === "weekly" && renderList(weekly, "weekly")}

      {/* Seasonal */}
      <InfoButton
        text="Seasonal Missions"
        onClick={() =>
          setOpenSection(openSection === "seasonal" ? null : "seasonal")
        }
      />
      {openSection === "seasonal" && renderList(seasonal, "seasonal")}

      {/* Completed */}
      <InfoButton
        text="Completed Missions"
        onClick={() =>
          setOpenSection(openSection === "completed" ? null : "completed")
        }
      />
      {openSection === "completed" && renderList(completed, "completed", true)}

      {/* Bloodlust */}
      <InfoButton
        text="Bloodlust"
        onClick={() => alert("Feature not available in beta")}
      />
    </div>
  );
}
