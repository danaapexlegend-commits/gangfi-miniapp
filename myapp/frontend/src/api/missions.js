// frontend/src/api/missions.js
import client from "./client";

/**
 * GET /api/missions
 * - Expect either array or object { weekly:[], seasonal:[], bloodlust:[], ... }
 */
export async function getMissions() {
  const res = await client.get("/missions");
  return res.data;
}

/**
 * POST /api/missions/pending
 * body: { missionId }
 * - may or may not exist on backend; frontend handles failure gracefully
 */
export async function markMissionPending(missionId) {
  const res = await client.post("/missions/pending", { missionId });
  return res.data;
}

/**
 * GET /api/missions/completed
 */
export async function getCompletedMissions() {
  const res = await client.get("/missions/completed");
  return res.data;
}
