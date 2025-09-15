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

  async function handleDailyReward() {
    try {
      const { user: updatedUser } = await claimDailyReward(user.id);
      setUser(updatedUser);
      alert("Daily reward claimed: +10!");
    } catch (err) {
      console.error(err);
      alert("Already claimed today or error!");
    }
  }

  async function handleGangSelect(g) {
    if (user.gang) {
      alert("You have already chosen a gang. You cannot change it now.");
      return;
    }

    try {
      const res = await setGang(g);
      if (res && res.success) {
        setUser(res.user);
        alert("Gang selected!");
      } else {
        alert(res.error || "Failed to set gang");
      }
    } catch (err) {
      console.error("setGang error", err);
      alert("Error setting gang");
    }
  }

  if (!user) return <div>Loading...</div>;

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
