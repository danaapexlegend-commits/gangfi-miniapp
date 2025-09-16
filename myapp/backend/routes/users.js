// routes/users.js
import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * GET /api/users/me
 * - اگه querystring شامل telegram_id باشه → همون یوزر رو میاره
 * - وگرنه اولین یوزر رو برمی‌گردونه (برای تست لوکال)
 */
router.get("/me", async (req, res) => {
  try {
    const { telegram_id } = req.query;
    let user;

    if (telegram_id) {
      user = await prisma.user.findUnique({
        where: { telegram_id: Number(telegram_id) },
        include: {
          socialAccounts: true,
          referralsMade: true,
          referralsGot: true,
          missions: true,
          loginRewards: true,
        },
      });
    } else {
      user = await prisma.user.findFirst({
        include: {
          socialAccounts: true,
          referralsMade: true,
          referralsGot: true,
          missions: true,
          loginRewards: true,
        },
      });
    }

    if (!user) return res.status(404).json({ error: "No user found" });

    res.json({ user });
  } catch (err) {
    console.error("GET /users/me error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/users/:id
 * گرفتن اطلاعات یوزر بر اساس id
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { socialAccounts: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET /users/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/users/set-gang
 * ست کردن گنگ برای کاربر (برای تست اولین یوزر رو آپدیت می‌کنیم)
 */
router.post("/set-gang", async (req, res) => {
  const { gang } = req.body;
  if (!gang) return res.status(400).json({ error: "Gang name required" });

  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { gang },
    });

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error("POST /users/set-gang error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/users/create
 * ساخت یوزر دستی برای تست (بدون auth تلگرام)
 */
router.post("/create", async (req, res) => {
  const { telegram_id, username, first_name } = req.body;
  if (!telegram_id) return res.status(400).json({ error: "telegram_id required" });

  try {
    const code = "G" + Math.random().toString(36).slice(2, 9).toUpperCase();
    const user = await prisma.user.create({
      data: {
        telegram_id: Number(telegram_id),
        username,
        first_name,
        referral_code: code,
      },
    });
    res.json({ success: true, user });
  } catch (err) {
    console.error("POST /users/create", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
