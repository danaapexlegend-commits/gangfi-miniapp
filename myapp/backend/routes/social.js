// routes/social.js
import express from "express";
import prisma from "../db.js";

const router = express.Router();

/**
 * POST /api/social/:id
 * body: { platform, username }
 * - platform: "twitter" یا "instagram"
 * - اگر username برای platform در DB متعلق به کاربر دیگری بود => خطا
 * - اگر کاربر قبلاً برای آن platform داشته و updated_at < 3 days => خطا
 * - در غیر اینصورت create یا update کن
 */
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  let { platform, username } = req.body;
  if (!platform || !username) return res.status(400).json({ error: "platform and username required" });

  platform = platform.toLowerCase();
  const allowed = ["twitter", "instagram"];
  if (!allowed.includes(platform)) return res.status(400).json({ error: "platform must be twitter or instagram" });

  try {
    // چک یکتا بودن username
    const existingUsername = await prisma.socialAccount.findFirst({ where: { platform, username }});
    if (existingUsername && existingUsername.user_id !== Number(id)) {
      return res.status(400).json({ error: "این یوزرنیم قبلاً توسط کاربر دیگری ثبت شده" });
    }

    const existing = await prisma.socialAccount.findFirst({ where: { user_id: Number(id), platform }});
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
        data: { user_id: Number(id), platform, username, updated_at: new Date() }
      });
      return res.json({ success: true, social: created });
    }
  } catch (err) {
    console.error("POST /social/:id", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/social/:id
 * لیست اکانت‌های کاربر
 */
router.get("/:id", async (req, res) => {
  try {
    const accounts = await prisma.socialAccount.findMany({ where: { user_id: Number(req.params.id) }});
    res.json(accounts);
  } catch (err) {
    console.error("GET /social/:id", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
