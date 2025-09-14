// pages/Missions.jsx
import React from "react";
import MissionAccordion from "../components/MissionAccordion";
import InfoButton from "../components/InfoButton";

function SampleTask({ text, tweetLink, reward = 50, status = "pending" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        alignItems: "center",
      }}
    >
      <div>
        <a href={tweetLink} target="_blank" rel="noreferrer">
          {text}
        </a>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ color: status === "completed" ? "green" : "#2b6cb0" }}>
          {status}
        </div>
        <div style={{ fontWeight: 600 }}>+{reward}</div>
      </div>
    </div>
  );
}

export default function Missions() {
  const weeklyTasks = [
    { id: 1, text: "Like and retweet this post", tweetLink: "https://twitter.com", reward: 50, status: "pending" },
    { id: 2, text: "Like and retweet this post", tweetLink: "https://twitter.com", reward: 50, status: "pending" },
    { id: 3, text: "Like and retweet this post", tweetLink: "https://twitter.com", reward: 50, status: "pending" },
  ];

  const seasonalTasks = [
    { id: 10, text: "Follow this account", tweetLink: "https://twitter.com/yourpage", reward: 100, status: "pending" },
  ];

  const dailyTasks = [{ id: 100, text: "Daily login", tweetLink: "#", reward: 10, status: "pending" }];

  return (
    <div style={{ paddingBottom: 90, paddingTop: 20 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <MissionAccordion title="Daily mission" rewardLabel="+10">
          {dailyTasks.map((t) => (
            <SampleTask key={t.id} {...t} />
          ))}
        </MissionAccordion>

        <MissionAccordion title="Weekly mission" rewardLabel="+50">
          {weeklyTasks.map((t) => (
            <SampleTask key={t.id} {...t} />
          ))}
        </MissionAccordion>

        <MissionAccordion title="Seasonal mission" rewardLabel="+100">
          {seasonalTasks.map((t) => (
            <SampleTask key={t.id} {...t} />
          ))}
        </MissionAccordion>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginTop: 16,
            background: "#000000ff",
          }}
        >
          <div style={{ fontWeight: 700 }}>Bloodlust (Gang takeover - upcoming)</div>
          <div style={{ marginTop: 8, color: "#666" }}>Feature disabled in Beta</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <InfoButton
            text="Test mission button"
            onClick={() => alert("This is a test action.")}
          />
        </div>
      </div>
    </div>
  );
}
