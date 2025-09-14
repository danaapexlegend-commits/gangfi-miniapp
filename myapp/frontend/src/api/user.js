// api/user.js
import client from "./client";

// گرفتن اطلاعات یوزر فعلی
export async function getCurrentUser() {
  const res = await client.get("/users/me");
  return res.data;
}

// گرفتن daily reward
export async function claimDailyReward() {
  const res = await client.post("/users/loginreward/claim");
  return res.data;
}

// انتخاب گنگ
export async function setGang(gangName) {
  const res = await client.post("/users/set-gang", { gang: gangName });
  return res.data;
}
