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

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

let allowedOrigins;
if (FRONTEND_ORIGIN === "*") {
  allowedOrigins = true; // یعنی همه آزاد
} else if (FRONTEND_ORIGIN.includes(",")) {
  allowedOrigins = FRONTEND_ORIGIN.split(",").map(o => o.trim());
} else {
  allowedOrigins = FRONTEND_ORIGIN;
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// لاگ درخواست‌ها
app.use(morgan("dev"));

// محدود کردن نرخ درخواست‌ها (برای auth مثلاً)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});
app.use("/api/auth", authLimiter);

// جلوگیری از cache برای endpoint ماموریت‌ها
app.use("/api/missions", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.removeHeader("ETag");
  next();
});

// routes اصلی
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/referrals", referralsRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/admin/missions", adminMissionRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/twitter", twitterRoutes);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
