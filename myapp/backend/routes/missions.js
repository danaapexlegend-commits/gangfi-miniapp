// routes/missions.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { fetchAllRetweeters, fetchAllFollowers } from "./twitterClient.js"; // helper که پایین میذارم
const router = express.Router();
const prisma = new PrismaClient();

/** گرفتن لیست ماموریت‌های فعال */
router.get("/", async (req, res) => {
  try {
    const missions = await prisma.mission.findMany({ where: { is_active: true }});
    res.json(missions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * چک کامل ماموریت هفتگی: فراخوانی twitter api برای گرفتن همه retweeters,
 * سپس مقایسه با socialAccounts و علامت‌گذاری completed + award
 */
router.post("/check-weekly/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await prisma.mission.findUnique({ where: { id: Number(id) }});
    if (!mission || mission.type !== "weekly") return res.status(404).json({ error: "weekly mission not found" });

    // fetch all retweeters (paginated + throttled)
    const usersList = await fetchAllRetweeters(mission.target_id);

    // normalize usernames (lowercase)
    const usernames = new Set(usersList.map(u => (u.userName || u.screen_name || u.username || "").toLowerCase()));

    // get all users with twitter account
    const appUsers = await prisma.user.findMany({ include: { socialAccounts: true }});

    const updated = [];
    for (const user of appUsers) {
      const twitter = user.socialAccounts.find(s => s.platform === "twitter");
      if (!twitter) continue;
      if (!twitter.username) continue;
      const uname = twitter.username.toLowerCase();
      if (usernames.has(uname)) {
        // check existing userMission
        const um = await prisma.userMission.findUnique({
          where: { user_id_mission_id: { user_id: user.id, mission_id: mission.id } }
        }).catch(()=>null);

        if (um && um.status === "completed") continue; // already awarded

        // atomic update: upsert userMission and inc user total_score
        await prisma.$transaction([
          prisma.userMission.upsert({
            where: { user_id_mission_id: { user_id: user.id, mission_id: mission.id } },
            update: { status: "completed", completed_at: new Date() },
            create: { user_id: user.id, mission_id: mission.id, status: "completed", completed_at: new Date() },
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { total_score: { increment: mission.reward_points } }
          })
        ]);

        updated.push({ userId: user.id, username: twitter.username });
      }
    }

    res.json({ success: true, completed: updated });
  } catch (err) {
    console.error("check-weekly error", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

/**
 * seasonal (followers) مشابه است
 */
router.post("/check-seasonal/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await prisma.mission.findUnique({ where: { id: Number(id) }});
    if (!mission || mission.type !== "seasonal") return res.status(404).json({ error: "seasonal mission not found" });

    const followers = await fetchAllFollowers(mission.target_id);

    const usernames = new Set(followers.map(u => (u.userName || u.screen_name || u.username || "").toLowerCase()));

    const appUsers = await prisma.user.findMany({ include: { socialAccounts: true }});

    const updated = [];
    for (const user of appUsers) {
      const twitter = user.socialAccounts.find(s => s.platform === "twitter");
      if (!twitter) continue;
      const uname = twitter.username.toLowerCase();
      if (usernames.has(uname)) {
        const um = await prisma.userMission.findUnique({
          where: { user_id_mission_id: { user_id: user.id, mission_id: mission.id } }
        }).catch(()=>null);

        if (um && um.status === "completed") continue;

        await prisma.$transaction([
          prisma.userMission.upsert({
            where: { user_id_mission_id: { user_id: user.id, mission_id: mission.id } },
            update: { status: "completed", completed_at: new Date() },
            create: { user_id: user.id, mission_id: mission.id, status: "completed", completed_at: new Date() },
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { total_score: { increment: mission.reward_points } }
          })
        ]);

        updated.push({ userId: user.id, username: twitter.username });
      }
    }

    res.json({ success: true, completed: updated });
  } catch (err) {
    console.error("check-seasonal error", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

export default router;
