// routes/auth.js
import express from "express";
import prisma from "../db.js";
import { checkTelegramAuth } from "../auth/telegramAuth.js";

const router = express.Router();

/**
 * POST /api/auth/login/telegram
 * body: { initData: "<querystring-like-from-telegram>" }
 * رفتار:
 *  - validate initData با checkTelegramAuth
 *  - اگر یوزر وجود نداشت، بساز
 *  - return user
 */
router.post("/login/telegram", async (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.status(400).json({ error: "initData required" });

  // initData ممکنه به فرم querystring باشه یا object
  // اگر querystring است، parse کن:
  let dataObj = {};
  if (typeof initData === "string") {
    const params = new URLSearchParams(initData);
    for (const [k, v] of params.entries()) dataObj[k] = v;
  } else if (typeof initData === "object") {
    dataObj = initData;
  }

  try {
    const ok = checkTelegramAuth(dataObj, process.env.BOT_TOKEN);
    if (!ok) return res.status(403).json({ error: "Invalid Telegram auth" });

    const telegram_id = Number(dataObj.id);
    const username = dataObj.username || null;
    const first_name = dataObj.first_name || null;

    let user = await prisma.user.findUnique({ where: { telegram_id } });

    if (!user) {
      // referral_code یکتا بساز
      const code = "G" + Math.random().toString(36).slice(2, 9).toUpperCase();
      user = await prisma.user.create({
        data: {
          telegram_id,
          username,
          first_name,
          referral_code: code
        }
      });
    } else {
      // آپدیت username/first_name اگر تغییر کرده
      await prisma.user.update({
        where: { id: user.id },
        data: { username, first_name }
      });
      user = await prisma.user.findUnique({ where: { id: user.id } });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("auth/login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
