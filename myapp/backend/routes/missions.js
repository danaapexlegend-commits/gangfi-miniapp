import express from "express";
import prisma from "../db.js";
import { fetchAllRetweeters, fetchAllFollowers } from "./twitterClient.js";

const router = express.Router();

/** گرفتن لیست ماموریت‌های فعال
 * query: ?telegram_id=12345
 */
router.get("/", async (req, res) => {
  const { telegram_id } = req.query;
  if (!telegram_id) return res.status(400).json({ error: "telegram_id query required" });

  try {
    const user = await prisma.user.findUnique({ where: { telegram_id: String(telegram_id) }});
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user.id;

    const missions = await prisma.mission.findMany({
      where: { is_active: true },
      include: {
        userMissions: {
          where: { user_id: userId }
        }
      }
    });

    const formatted = missions
      .map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        reward_points: m.reward_points,
        missionLink: m.missionLink,
        type: m.type,
        status: m.userMissions[0]?.status || null
      }))
      .filter(m => m.status !== "completed"); // فقط ماموریت‌های ناقص

    const grouped = {
      weekly: formatted.filter(m => m.type === "weekly"),
      seasonal: formatted.filter(m => m.type === "seasonal")
    };

    res.json(grouped);
  } catch (err) {
    console.error("GET /missions error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// گرفتن ماموریت‌های تکمیل‌شده
// query: ?telegram_id=12345
router.get("/completed", async (req, res) => {
  const { telegram_id } = req.query;
  if (!telegram_id) return res.status(400).json({ error: "telegram_id query required" });

  try {
    const user = await prisma.user.findUnique({ where: { telegram_id: String(telegram_id) }});
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user.id;

    const completed = await prisma.userMission.findMany({
      where: { user_id: userId, status: "completed" },
      include: { mission: true }
    });

    res.json({
      missions: completed.map(c => ({
        id: c.mission.id,
        description: c.mission.description,
        reward_points: c.mission.reward_points,
        missionLink: c.mission.missionLink
      }))
    });
  } catch (err) {
    console.error("GET /missions/completed error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// شروع ماموریت → pending
router.post("/:id/start", async (req, res) => {
  const { id } = req.params;
  const { telegram_id } = req.body;
  if (!telegram_id) return res.status(400).json({ error: "telegram_id required in body" });

  try {
    const mission = await prisma.mission.findUnique({ where: { id: Number(id) } });
    if (!mission) return res.status(404).json({ error: "Mission not found" });

    const user = await prisma.user.findUnique({ where: { telegram_id: String(telegram_id) }});
    if (!user) return res.status(404).json({ error: "User not found" });

    const userMission = await prisma.userMission.upsert({
      where: {
        user_id_mission_id: {
          user_id: user.id,
          mission_id: Number(id),
        }
      },
      update: { status: "pending" },
      create: {
        user_id: user.id,
        mission_id: Number(id),
        status: "pending"
      }
    });

    res.json({ success: true, userMission });
  } catch (err) {
    console.error("POST /missions/:id/start error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// چک هفتگی → با fetchAllRetweeters
router.post("/check-weekly/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await prisma.mission.findUnique({ where: { id: Number(id) } });
    if (!mission || mission.type !== "weekly") {
      return res.status(404).json({ error: "weekly mission not found" });
    }

    const usersList = await fetchAllRetweeters(mission.target_id);
    const usernames = new Set(usersList.map(u =>
      (u.userName || u.screen_name || u.username || "").toLowerCase()
    ));

    const appUsers = await prisma.user.findMany({ include: { socialAccounts: true } });
    const updated = [];

    for (const user of appUsers) {
      const twitter = user.socialAccounts.find(s => s.platform === "twitter");
      if (!twitter?.username) continue;

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
    console.error("check-weekly error", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// چک seasonal → با fetchAllFollowers
router.post("/check-seasonal/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await prisma.mission.findUnique({ where: { id: Number(id) } });
    if (!mission || mission.type !== "seasonal") {
      return res.status(404).json({ error: "seasonal mission not found" });
    }

    const followers = await fetchAllFollowers(mission.target_id);
    const usernames = new Set(followers.map(u =>
      (u.userName || u.screen_name || u.username || "").toLowerCase()
    ));

    const appUsers = await prisma.user.findMany({ include: { socialAccounts: true } });
    const updated = [];

    for (const user of appUsers) {
      const twitter = user.socialAccounts.find(s => s.platform === "twitter");
      if (!twitter?.username) continue;

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
