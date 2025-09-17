//auth/telegramAuth.js

import crypto from "crypto";

/**
 * checkTelegramAuth
 * داده‌های initData (query string) را با الگوریتم رسمی تلگرام validate می‌کند.
 */
export function checkTelegramAuth(initData, botToken) {
  // 1. تبدیل به key=value
  const params = new URLSearchParams(initData);

  // 2. hash رو جدا کن
  const receivedHash = params.get("hash");
  params.delete("hash");

  // 3. رشته check_string بساز (key=value \n ...)
  const dataCheckString = Array.from(params.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  // 4. secret_key بساز
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // 5. hash واقعی بساز
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === receivedHash;
}
