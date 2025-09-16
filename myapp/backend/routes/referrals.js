// routes/referrals.js
import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * POST /api/referrals/invite
 * وقتی کاربری از طریق لینک وارد شد
 * body: { inviterCode, invitedId }
 */
router.post("/invite", async (req, res) => {
  const { inviterCode, invitedId } = req.body;
  if (!inviterCode || !invitedId)
    return res.status(400).json({ error: "inviterCode and invitedId required" });

  try {
    const inviter = await prisma.user.findUnique({ where: { referral_code: inviterCode } });
    if (!inviter) return res.status(404).json({ error: "Inviter not found" });

    const invited = await prisma.user.findUnique({ where: { id: Number(invitedId) } });
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
 * وقتی کاربر خودش دستی کد رو وارد میکنه
 * body: { userId, inviterCode }
 */
router.post("/set-invited-by", async (req, res) => {
  const { userId, inviterCode } = req.body;
  if (!userId || !inviterCode)
    return res.status(400).json({ error: "userId and inviterCode required" });

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.invited_by) return res.status(400).json({ error: "invited_by already set" });

    const inviter = await prisma.user.findUnique({ where: { referral_code: inviterCode } });
    if (!inviter) return res.status(404).json({ error: "Inviter not found" });

    await prisma.$transaction([
      prisma.user.update({
        where: { id: Number(userId) },
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
        data: { inviter_id: inviter.id, invited_id: Number(userId) }
      })
    ]);

    res.json({ success: true, message: "invited_by set and rewards applied" });
  } catch (err) {
    console.error("POST /referrals/set-invited-by", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
