// routes/twitter.js
import express from "express";
import axios from "axios";
import { fetchAllRetweeters, fetchAllFollowers } from "./twitterClient.js";

const router = express.Router();
const BASE = "https://api.twitterapi.io";

/**
 * GET /api/twitter/ping
 * چک سلامت کلید API
 */
router.get("/ping", async (req, res) => {
  try {
    // endpoint تستی؛ در docs دقیق‌ترین مسیر را بررسی کن
    const r = await axios.get(`${BASE}/twitter/user/by/username?username=twitter`, {
      headers: { "X-API-Key": process.env.TWITTER_API_KEY }
    });
    res.json({ ok: true, data: r.data });
  } catch (err) {
    console.error("twitter ping error", err.response?.data || err.message);
    res.status(500).json({ ok: false, error: err.response?.data || err.message });
  }
});

/**
 * GET /api/twitter/retweetersOnce?tweetId=...
 * بازگشت یک صفحه از retweeters (بدون پیمایش)
 */
router.get("/retweetersOnce", async (req, res) => {
  const { tweetId, cursor } = req.query;
  if (!tweetId) return res.status(400).json({ error: "tweetId required" });
  try {
    const url = `${BASE}/twitter/tweet/retweeters?tweetId=${encodeURIComponent(tweetId)}${cursor ? `&cursor=${cursor}` : ""}`;
    const r = await axios.get(url, { headers: { "X-API-Key": process.env.TWITTER_API_KEY }});
    res.json(r.data);
  } catch (err) {
    console.error("retweetersOnce err", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * GET /api/twitter/followersOnce?userName=...
 * بازگشت یک صفحه از followers (بدون پیمایش)
 */
router.get("/followersOnce", async (req, res) => {
  const { userName, cursor } = req.query;
  if (!userName) return res.status(400).json({ error: "userName required" });
  try {
    const url = `${BASE}/twitter/user/followers?pageSize=200&userName=${encodeURIComponent(userName)}${cursor ? `&cursor=${cursor}` : ""}`;
    const r = await axios.get(url, { headers: { "X-API-Key": process.env.TWITTER_API_KEY }});
    res.json(r.data);
  } catch (err) {
    console.error("followersOnce err", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * POST /api/twitter/retweetersAll
 * body: { tweetId }
 * این route از helper استفاده می‌کند تا همه صفحات را جمع کند و آرایه userها را برگرداند
 */
router.post("/retweetersAll", async (req, res) => {
  const { tweetId } = req.body;
  if (!tweetId) return res.status(400).json({ error: "tweetId required" });
  try {
    const all = await fetchAllRetweeters(tweetId);
    res.json({ success: true, total: all.length, users: all });
  } catch (err) {
    console.error("retweetersAll err", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

/**
 * POST /api/twitter/followersAll
 * body: { userName }
 */
router.post("/followersAll", async (req, res) => {
  const { userName } = req.body;
  if (!userName) return res.status(400).json({ error: "userName required" });
  try {
    const all = await fetchAllFollowers(userName);
    res.json({ success: true, total: all.length, users: all });
  } catch (err) {
    console.error("followersAll err", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

export default router;
