-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('KNIGHT', 'MEDYSA_AI');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tier" "SubscriptionTier" NOT NULL DEFAULT 'KNIGHT';
