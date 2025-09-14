// auth/telegramAuth.js
import crypto from "crypto";

/**
 * checkTelegramAuth
 * داده‌های initData که از Telegram Web App میاد رو validate می‌کنه.
 * botToken رو از .env بگیر
 */
export function checkTelegramAuth(data, botToken) {
  const { hash, ...userData } = data;

  const checkString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  return hmac === hash;
}
