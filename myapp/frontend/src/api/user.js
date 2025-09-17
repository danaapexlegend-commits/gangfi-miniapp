import client from "./client";

// ✅ لاگین با تلگرام
export async function loginWithTelegram() {
  // از خود WebApp بگیر
  const initData = window.Telegram?.WebApp?.initData;
  if (!initData) throw new Error("Telegram initData not found");

  console.log("📩 Sending initData to backend:", initData);

  const res = await client.post("/auth/login/telegram", { initData });
  return res.data;
}

// گرفتن یوزر فعلی بعد از لاگین
export async function getCurrentUser(telegramId) {
  if (!telegramId) throw new Error("telegram_id required");

  const res = await client.get(`/users/me?telegram_id=${String(telegramId)}`);
  return res.data;
}

// گرفتن daily reward
export async function claimDailyReward(telegramId) {
  const res = await client.post("/rewards/daily", { telegram_id: String(telegramId) });
  return res.data;
}

// انتخاب گنگ
export async function setGang(gangName, telegramId) {
  const res = await client.post("/users/set-gang", {
    gang: gangName,
    telegram_id: String(telegramId),
  });
  return res.data;
}
