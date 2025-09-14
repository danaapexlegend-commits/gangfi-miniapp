-- CreateTable
CREATE TABLE "ReferralInvite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inviter_id" INTEGER NOT NULL,
    "invited_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralInvite_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralInvite_invited_id_fkey" FOREIGN KEY ("invited_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reward_points" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "UserMission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "mission_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completed_at" DATETIME,
    CONSTRAINT "UserMission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserMission_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "Mission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LoginReward" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "reward_points" INTEGER NOT NULL,
    CONSTRAINT "LoginReward_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    CONSTRAINT "SocialAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
