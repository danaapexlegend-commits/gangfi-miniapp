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
    // بررسی اینکه امروز قبلاً claim شده است یا خیر
    const since = new Date();
    since.setUTCHours(0,0,0,0);
    const existing = await prisma.loginReward.findFirst({
      where: {
        user_id: Number(userId),
        date: {
          gte: since
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: "Already claimed today" });
    }

    const reward = await prisma.loginReward.create({
      data: { user_id: Number(userId), date: new Date(), reward_points: 10 }
    });

    const updatedUser = await prisma.user.update({ where: { id: Number(userId) }, data: { total_score: { increment: 10 } } });

    res.json({ success: true, reward, user: updatedUser });
  } catch (err) {
    console.error("POST /rewards/daily", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
