/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `OpeningHour` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."OpeningHour_tenantId_dayOfWeek_date_key";

-- DropIndex
DROP INDEX "public"."OpeningHour_tenantId_dayOfWeek_idx";

-- AlterTable
ALTER TABLE "public"."OpeningHour" DROP COLUMN "dayOfWeek";
