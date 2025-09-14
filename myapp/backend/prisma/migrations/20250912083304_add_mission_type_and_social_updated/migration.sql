/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `SocialAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SocialAccount" ADD COLUMN "updated_at" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reward_points" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL DEFAULT 'weekly',
    "target_link" TEXT,
    "target_id" TEXT
);
INSERT INTO "new_Mission" ("description", "id", "is_active", "reward_points", "title") SELECT "description", "id", "is_active", "reward_points", "title" FROM "Mission";
DROP TABLE "Mission";
ALTER TABLE "new_Mission" RENAME TO "Mission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_username_key" ON "SocialAccount"("username");
