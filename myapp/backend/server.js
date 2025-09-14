// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// routes
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import referralsRoutes from "./routes/referrals.js";
import rewardsRoutes from "./routes/loginRewards.js";
import socialRoutes from "./routes/social.js";
import adminMissionRoutes from "./routes/adminMissions.js";
import missionRoutes from "./routes/missions.js";
import twitterRoutes from "./routes/twitter.js";

const app = express();

app.use(express.json());

// امنیت پایه
app.use(helmet());

// اجازه دسترسی فقط به فرانت‌تون — در production مقدار را به دامنهٔ واقعی تغییر بده

app.use(cors({
  origin: "http://localhost:5173",  // آدرس فرانت
  credentials: true
}));

// لاگ درخواست‌ها
app.use(morgan("dev"));

// محدودیت کلی درخواست (قابل تنظیم)
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 400, // max requests per window per IP (تست)
  message: { error: "Too many requests, try later" }
}));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/referrals", referralsRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/admin/missions", adminMissionRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/twitter", twitterRoutes);

// health
app.get("/api/ping", (req, res) => res.json({ ok: true, now: new Date() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
