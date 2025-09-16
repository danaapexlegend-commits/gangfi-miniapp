// api/user.js
import client from "./client";


export async function getCurrentUser() {
  let tgId = 1; // 👈 fallback برای تست لوکال
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    tgId = window.Telegram.WebApp.initDataUnsafe.user.id;
  }

  const res = await client.get(`/users/me?telegram_id=${tgId}`);
  return res.data;
}

// گرفتن daily reward
export async function claimDailyReward(userId) {
  // backend expects { userId } in body at POST /api/rewards/daily
  const res = await client.post("/rewards/daily", { userId });
  return res.data;
}

// انتخاب گنگ
export async function setGang(gangName) {
  const res = await client.post("/users/set-gang", { gang: gangName });
  return res.data;
}
