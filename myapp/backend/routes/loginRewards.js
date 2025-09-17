import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * POST /api/rewards/daily
 * body: { telegram_id }
 */
router.post("/daily", async (req, res) => {
  const { telegram_id } = req.body;
  if (!telegram_id) return res.status(400).json({ error: "telegram_id required" });

  try {
    const user = await prisma.user.findUnique({
      where: { telegram_id: String(telegram_id) }
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);

    const existing = await prisma.loginReward.findFirst({
      where: {
        user_id: user.id,
        date: { gte: since }
      }
    });

    if (existing) {
      return res.status(400).json({ error: "Already claimed today" });
    }

    const reward = await prisma.loginReward.create({
      data: { user_id: user.id, date: new Date(), reward_points: 10 }
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { total_score: { increment: 10 } }
    });

    res.json({ success: true, reward, user: updatedUser });
  } catch (err) {
    console.error("POST /rewards/daily", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
