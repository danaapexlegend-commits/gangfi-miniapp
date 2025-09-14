// routes/twitterClient.js
import axios from "axios";
import Bottleneck from "bottleneck";

const BASE = "https://api.twitterapi.io"; // اگر docs متفاوت هست اصلاح کن
const KEY = process.env.TWITTER_API_KEY;

// limiter: 5 req/sec (minTime 200ms) — می‌تونی این عدد رو بر اساس پلان تغییر بدی
const limiter = new Bottleneck({ minTime: 200 });

async function getOnce(url) {
  return limiter.schedule(() => axios.get(url, { headers: { "X-API-Key": KEY }, timeout: 20000 }));
}

/**
 * fetchAllRetweeters(tweetId)
 * جمع‌آوری همهٔ ری‌تویترها با پیمایش صفحه به صفحه
 * خروجی: آرایه از user objects (بسته به ساختار API ممکنه کلیدها فرق کنه)
 */
export async function fetchAllRetweeters(tweetId) {
  let cursor = "";
  const all = [];
  while (true) {
    const url = `${BASE}/twitter/tweet/retweeters?tweetId=${encodeURIComponent(tweetId)}${cursor ? `&cursor=${cursor}` : ""}`;
    const r = await getOnce(url);
    const data = r.data;
    if (!data) break;

    // داده‌ها در data.users یا data.retweeters یا data هم می‌توانند باشند — انعطاف
    const users = data.users || data.retweeters || data || [];
    if (Array.isArray(users) && users.length) all.push(...users);

    if (!data.has_next_page) break;
    if ((!users || users.length === 0)) break;
    cursor = data.next_cursor || data.cursor || "";
    if (!cursor) break;
  }
  return all;
}

/**
 * fetchAllFollowers(userName)
 * جمع‌آوری همهٔ followerها برای یک username
 */
export async function fetchAllFollowers(userName) {
  let cursor = "";
  const all = [];
  while (true) {
    const url = `${BASE}/twitter/user/followers?pageSize=200&userName=${encodeURIComponent(userName)}${cursor ? `&cursor=${cursor}` : ""}`;
    const r = await getOnce(url);
    const data = r.data;
    if (!data) break;

    const users = data.followers || data.users || [];
    if (Array.isArray(users) && users.length) all.push(...users);

    if (!data.has_next_page) break;
    if ((!users || users.length === 0)) break;
    cursor = data.next_cursor || data.cursor || "";
    if (!cursor) break;
  }
  return all;
}
