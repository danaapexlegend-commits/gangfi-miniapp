// pages/ComingSoon.jsx
import React from "react";
import InfoButton from "../components/InfoButton";

/*
  ComingSoon page:
  - shows list of future features
  - uses InfoButton for consistent style
*/

export default function ComingSoon() {
  const features = ["Leaderboard", "World War", "Bloodlust", "Instagram feature"];

  return (
    <div style={{ paddingBottom: 90, paddingTop: 20 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2>Coming soon</h2>

        {features.map((f, idx) => (
          <InfoButton key={idx} text={f} onClick={() => alert(`${f} is not ready yet`)} />
        ))}
      </div>
    </div>
  );
}
