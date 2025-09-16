// routes/adminMissions.js
import express from "express";
import prisma from "../db.js";
import fetch from "node-fetch"; // بالای فایل


const router = express.Router();

/**
 * POST /api/admin/missions/create
 * body: { title, description, reward_points, type, target_link, target_id }
 * type: "weekly" یا "seasonal"
 */
router.post("/create", async (req, res) => {
  const { title, description, reward_points, type, target_link, target_id, missionLink } = req.body;
  if (!title || !reward_points || !type) return res.status(400).json({ error: "title, reward_points and type required" });
  if (!["weekly", "seasonal"].includes(type)) return res.status(400).json({ error: "type must be weekly or seasonal" });

  try {
    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        reward_points: Number(reward_points),
        is_active: true,
        type,
        target_link,
        target_id,
        missionLink   // 👈 اضافه شد
      }
    });
    res.json({ success: true, mission });
  } catch (err) {
    console.error("POST /admin/missions/create", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET all missions (for admin)
router.get("/all", async (req, res) => {
  try {
    const missions = await prisma.mission.findMany();
    res.json(missions);
  } catch (err) {
    console.error("GET /admin/missions/all", err);
    res.status(500).json({ error: "Server error" });
  }
});

// update mission
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, reward_points, is_active, type, target_link, target_id, missionLink } = req.body;
  try {
    const mission = await prisma.mission.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        reward_points: Number(reward_points),
        is_active,
        type,
        target_link,
        target_id,
        missionLink   // 👈 اضافه شد
      }
    });
    res.json({ success: true, mission });
  } catch (err) {
    console.error("PUT /admin/missions/update/:id", err);
    res.status(500).json({ error: "Server error" });
  }
});

// deactivate
router.put("/deactivate/:id", async (req, res) => {
  try {
    const mission = await prisma.mission.update({ 
      where: { id: Number(req.params.id) }, 
      data: { is_active: false }
    });

    // بعد از غیر فعال کردن، چک کردن رو هم صدا بزنیم
    if (mission.type === "weekly") {
      await fetch(`http://localhost:3000/api/missions/check-weekly/${mission.id}`, {
        method: "POST"
      });
    }
    if (mission.type === "seasonal") {
      await fetch(`http://localhost:3000/api/missions/check-seasonal/${mission.id}`, {
        method: "POST"
      });
    }

    res.json({ success: true, mission });
  } catch (err) {
    console.error("PUT /admin/missions/deactivate/:id", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
