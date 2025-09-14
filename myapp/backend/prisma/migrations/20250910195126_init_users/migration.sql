-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_id" INTEGER NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "referral_code" TEXT NOT NULL,
    "invited_by" TEXT,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "referral_count" INTEGER NOT NULL DEFAULT 0,
    "gang" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_referral_code_key" ON "User"("referral_code");
