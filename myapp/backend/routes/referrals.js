import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * POST /api/referrals/invite
 * body: { inviterCode, invited_telegram_id }
 */
router.post("/invite", async (req, res) => {
  const { inviterCode, invited_telegram_id } = req.body;
  if (!inviterCode || !invited_telegram_id)
    return res.status(400).json({ error: "inviterCode and invited_telegram_id required" });

  try {
    const inviter = await prisma.user.findUnique({ where: { referral_code: inviterCode } });
    if (!inviter) return res.status(404).json({ error: "Inviter not found" });

    const invited = await prisma.user.findUnique({ where: { telegram_id: String(invited_telegram_id) } });
    if (!invited) return res.status(404).json({ error: "Invited user not found" });

    const existing = await prisma.referralInvite.findFirst({
      where: { inviter_id: inviter.id, invited_id: invited.id }
    });
    if (existing) return res.status(400).json({ error: "Referral already exists" });

    await prisma.$transaction([
      prisma.referralInvite.create({
        data: { inviter_id: inviter.id, invited_id: invited.id }
      }),
      prisma.user.update({
        where: { id: inviter.id },
        data: {
          total_score: { increment: 100 },
          referral_count: { increment: 1 }
        }
      })
    ]);

    res.json({ success: true, message: "Referral recorded" });
  } catch (err) {
    console.error("POST /referrals/invite", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/referrals/set-invited-by
 * body: { telegram_id, inviterCode }
 */
router.post("/set-invited-by", async (req, res) => {
  const { telegram_id, inviterCode } = req.body;

  if (!telegram_id || !inviterCode) {
    return res.status(400).json({ error: "telegram_id and inviterCode required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { telegram_id: String(telegram_id) } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.invited_by) return res.status(400).json({ error: "invited_by already set" });

    const inviter = await prisma.user.findUnique({ where: { referral_code: inviterCode } });
    if (!inviter) return res.status(404).json({ error: "Inviter not found" });

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          invited_by: inviterCode,
          total_score: { increment: 150 }
        }
      }),
      prisma.user.update({
        where: { id: inviter.id },
        data: {
          referral_count: { increment: 1 },
          total_score: { increment: 100 }
        }
      }),
      prisma.referralInvite.create({
        data: { inviter_id: inviter.id, invited_id: user.id }
      })
    ]);

    res.json({ success: true, message: "invited_by set and rewards applied", user: updatedUser });
  } catch (err) {
    console.error("POST /referrals/set-invited-by", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
