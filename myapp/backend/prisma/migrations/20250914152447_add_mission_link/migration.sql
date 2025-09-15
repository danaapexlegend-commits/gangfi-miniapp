/*
  Warnings:

  - A unique constraint covering the columns `[user_id,mission_id]` on the table `UserMission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Mission" ADD COLUMN "missionLink" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_id" INTEGER,
    "username" TEXT,
    "first_name" TEXT,
    "referral_code" TEXT NOT NULL,
    "invited_by" TEXT,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "referral_count" INTEGER NOT NULL DEFAULT 0,
    "gang" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("created_at", "first_name", "gang", "id", "invited_by", "referral_code", "referral_count", "telegram_id", "total_score", "username") SELECT "created_at", "first_name", "gang", "id", "invited_by", "referral_code", "referral_count", "telegram_id", "total_score", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");
CREATE UNIQUE INDEX "User_referral_code_key" ON "User"("referral_code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserMission_user_id_mission_id_key" ON "UserMission"("user_id", "mission_id");
