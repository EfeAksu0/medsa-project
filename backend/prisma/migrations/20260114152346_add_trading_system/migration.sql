/*
  Warnings:

  - You are about to drop the column `session` on the `trades` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trades" DROP COLUMN "session",
ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "modelId" TEXT,
ADD COLUMN     "sessionId" TEXT;

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currentBalance" DECIMAL(12,2) NOT NULL,
    "goalBalance" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psychology_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',

    CONSTRAINT "psychology_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mistake_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#ef4444',

    CONSTRAINT "mistake_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_psychology" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "psychologyTagId" TEXT NOT NULL,

    CONSTRAINT "trade_psychology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_mistakes" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "mistakeTagId" TEXT NOT NULL,

    CONSTRAINT "trade_mistakes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_name_key" ON "sessions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "psychology_tags_name_key" ON "psychology_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mistake_tags_name_key" ON "mistake_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "trade_psychology_tradeId_psychologyTagId_key" ON "trade_psychology"("tradeId", "psychologyTagId");

-- CreateIndex
CREATE UNIQUE INDEX "trade_mistakes_tradeId_mistakeTagId_key" ON "trade_mistakes"("tradeId", "mistakeTagId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_psychology" ADD CONSTRAINT "trade_psychology_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_psychology" ADD CONSTRAINT "trade_psychology_psychologyTagId_fkey" FOREIGN KEY ("psychologyTagId") REFERENCES "psychology_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_mistakes" ADD CONSTRAINT "trade_mistakes_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_mistakes" ADD CONSTRAINT "trade_mistakes_mistakeTagId_fkey" FOREIGN KEY ("mistakeTagId") REFERENCES "mistake_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
