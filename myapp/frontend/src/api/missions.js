import client from "./client";

/**
 * GET /api/missions
 * - Expect either array or object { weekly:[], seasonal:[], bloodlust:[], ... }
 */
export async function getMissions(telegramId) {
  const res = await client.get(`/missions?telegram_id=${String(telegramId)}`);
  return res.data;
}

/**
 * POST /api/missions/:id/start
 * body: { telegram_id }
 */
export async function markMissionPending(missionId, telegramId) {
  const res = await client.post(`/missions/${missionId}/start`, { telegram_id: String(telegramId) });
  return res.data;
}

/**
 * GET /api/missions/completed
 */
export async function getCompletedMissions(telegramId) {
  const res = await client.get(`/missions/completed?telegram_id=${String(telegramId)}`);
  return res.data;
}
