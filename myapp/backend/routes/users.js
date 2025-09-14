// routes/users.js
import express from "express";
import prisma from "../db.js";

const router = express.Router();

// GET /api/users/me
// برگردوندن اولین یوزر (فقط برای تست)
router.get("/me", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      include: { 
        socialAccounts: true, 
        referralsMade: true,
        referralsGot: true,
        missions: true,
        loginRewards: true
      }
    });

    if (!user) return res.status(404).json({ error: "No user found" });

    res.json({ user });
  } catch (err) {
    console.error("GET /users/me error", err);
    res.status(500).json({ error: "Server error" });
  }
});



/**
 * GET /api/users/:id
 * برگرداندن اطلاعات user بر اساس id (یا براحتی می‌تونی روش براساس telegram_id تغییر بدی)
 * includes socialAccounts برای نمایش usernameهای توییتر/اینستا
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { socialAccounts: true }
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
 */
router.post("/set-gang", async (req, res) => {
  const { gang } = req.body;
  if (!gang) return res.status(400).json({ error: "Gang name required" });

  try {
    // برای تست: اولین یوزر رو پیدا کن
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { gang }
    });

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error("POST /users/set-gang error", err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * POST /api/users/create
 * ساخت یوزر دستی برای تست (نمی‌زنیم auth تلگرام)
 * body: { telegram_id, username, first_name }
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
        referral_code: code
      }
    });
    res.json({ success: true, user });
  } catch (err) {
    console.error("POST /users/create", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
