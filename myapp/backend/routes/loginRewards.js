// routes/loginRewards.js
import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * POST /api/rewards/daily
 * body: { userId }
 * - اگر امروز به وقت UTC قبلاً claim شده => خطا
 * - در غیر اینصورت رکورد بساز و total_score +10
 */
router.post("/daily", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const existing = await prisma.loginReward.findFirst({
      where: { user_id: Number(userId), date: { gte: todayUtc } }
    });
    if (existing) return res.status(400).json({ error: "Already claimed today" });

    const reward = await prisma.loginReward.create({
      data: { user_id: Number(userId), date: new Date(), reward_points: 10 }
    });

    await prisma.user.update({ where: { id: Number(userId) }, data: { total_score: { increment: 10 } } });

    res.json({ success: true, reward });
  } catch (err) {
    console.error("POST /rewards/daily", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
