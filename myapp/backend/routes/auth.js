import express from "express";
import prisma from "../db.js";
import { checkTelegramAuth } from "../auth/telegramAuth.js";
import { nanoid } from "nanoid";

const router = express.Router();

/**
 * POST /api/auth/login/telegram
 * body: { initData: "<querystring-like-from-telegram>" }
 */
router.post("/login/telegram", async (req, res) => {
  const { initData } = req.body;
  if (!initData) {
    console.error("❌ No initData received");
    return res.status(400).json({ error: "initData required" });
  }

  try {
    console.log("📩 Raw initData:", initData);

    // 🔑 Telegram hash validation
    const ok = checkTelegramAuth(initData, process.env.BOT_TOKEN);
    if (!ok) {
      console.error("❌ Invalid Telegram auth — hash mismatch");
      return res.status(403).json({ error: "Invalid Telegram auth" });
    }
    console.log("✅ Telegram auth verified");

    // 📦 Parse initData
    const params = new URLSearchParams(initData);
    const rawUser = params.get("user");
    let userObj = null;
    try {
      userObj = rawUser ? JSON.parse(rawUser) : null;
    } catch (err) {
      console.error("❌ JSON parse error:", rawUser, err);
      return res.status(400).json({ error: "Invalid user JSON" });
    }

    console.log("👤 Parsed user object:", userObj);

    if (!userObj?.id) {
      console.error("❌ No user id found in initData");
      return res.status(400).json({ error: "Invalid user data" });
    }

    const telegram_id = String(userObj.id); // 👉 مهم: به string ذخیره بشه
    const username = userObj?.username || null;
    const first_name = userObj?.first_name || null;

    console.log("🔎 Checking user in DB:", { telegram_id, username, first_name });

    // 📌 Find or create user
    let user = await prisma.user.findUnique({ where: { telegram_id } });

    if (!user) {
      // referral_code بساز
      let code, exists = true;
      while (exists) {
        code = "G" + nanoid(7).toUpperCase();
        const existing = await prisma.user.findUnique({
          where: { referral_code: code },
        });
        if (!existing) exists = false;
      }

      console.log("➕ Creating new user with referral:", code);

      try {
        user = await prisma.user.create({
          data: {
            telegram_id,
            username,
            first_name,
            referral_code: code,
            referral_count: 0,
            total_score: 0,
          },
        });
        console.log("✅ User created:", user);
      } catch (err) {
        console.error("❌ Prisma create error:", err);
        return res.status(500).json({ error: "DB create error", details: err.message });
      }
    } else {
      console.log("🔄 Updating existing user:", user.id);

      try {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { username, first_name },
        });
        console.log("✅ User updated:", user);
      } catch (err) {
        console.error("❌ Prisma update error:", err);
        return res.status(500).json({ error: "DB update error", details: err.message });
      }
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ auth/login error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
