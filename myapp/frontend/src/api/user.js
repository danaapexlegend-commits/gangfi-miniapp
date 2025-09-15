// api/user.js
import client from "./client";

// گرفتن اطلاعات یوزر فعلی
export async function getCurrentUser() {
  const res = await client.get("/users/me");
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
