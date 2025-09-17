import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * POST /api/social/:telegram_id
 */
router.post("/:telegram_id", async (req, res) => {
  const { telegram_id } = req.params;
  let { platform, username } = req.body;
  if (!platform || !username) return res.status(400).json({ error: "platform and username required" });

  platform = platform.toLowerCase();
  const allowed = ["twitter", "instagram"];
  if (!allowed.includes(platform)) return res.status(400).json({ error: "platform must be twitter or instagram" });

  try {
    const user = await prisma.user.findUnique({ where: { telegram_id: String(telegram_id) }});
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingUsername = await prisma.socialAccount.findFirst({ where: { platform, username }});
    if (existingUsername && existingUsername.user_id !== user.id) {
      return res.status(400).json({ error: "این یوزرنیم قبلاً توسط کاربر دیگری ثبت شده" });
    }

    const existing = await prisma.socialAccount.findFirst({ where: { user_id: user.id, platform }});
    if (existing) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      if (existing.updated_at && existing.updated_at > threeDaysAgo) {
        return res.status(400).json({ error: "هر ۳ روز یک بار می‌توانید تغییر دهید" });
      }

      const updated = await prisma.socialAccount.update({
        where: { id: existing.id },
        data: { username, updated_at: new Date() }
      });
      return res.json({ success: true, social: updated });
    } else {
      const created = await prisma.socialAccount.create({
        data: { user_id: user.id, platform, username, updated_at: new Date() }
      });
      return res.json({ success: true, social: created });
    }
  } catch (err) {
    console.error("POST /social/:telegram_id", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/social/:telegram_id
 */
router.get("/:telegram_id", async (req, res) => {
  try {
    const { telegram_id } = req.params;
    const user = await prisma.user.findUnique({ where: { telegram_id: String(telegram_id) }});
    if (!user) return res.status(404).json({ error: "User not found" });

    const accounts = await prisma.socialAccount.findMany({ where: { user_id: user.id }});
    res.json(accounts);
  } catch (err) {
    console.error("GET /social/:telegram_id", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
