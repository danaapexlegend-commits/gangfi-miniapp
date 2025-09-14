// pages/Dashboard.jsx
import React, { useContext } from "react";
import InfoButton from "../components/InfoButton";
import GangSelector from "../components/GangSelector";
import { UserContext } from "../context/UserContext";

import { claimDailyReward, setGang } from "../api/user";

/*
  Dashboard page:
  - shows user total score and rank
  - includes GangSelector component
  - daily reward claim
*/

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);

  // گرفتن daily reward
  async function handleDailyReward() {
    try {
      const data = await claimDailyReward();
      setUser((prev) => ({ ...prev, total_score: data.total_score }));
      alert("Daily reward claimed!");
    } catch (err) {
        console.error(err);
      alert("Already claimed today or error!");
    }
  }

  // انتخاب گنگ → فقط یکبار
  async function handleGangSelect(g) {
    if (user.gang) {
      alert("You have already chosen a gang. You cannot change it now.");
      return;
    }

    try {
      const data = await setGang(g.name); // ذخیره توی دیتابیس
      setUser((prev) => ({ ...prev, gang: data.gang }));
    } catch (err) {
      console.error("Gang select failed", err);
      alert("Failed to set gang");
    }
  }

  return (
    <div style={{ padding: 20, paddingBottom: 90 }}>
      <h2>Dashboard</h2>
      <p>Total score: {user.total_score}</p>
      <p>Global rank: {user.global_rank || 0}</p>

      <GangSelector selectedGang={user.gang} onSelect={handleGangSelect} />

      <div style={{ marginTop: 20 }}>
        <InfoButton text="Claim daily reward (+10)" onClick={handleDailyReward} />
      </div>
    </div>
  );
}
