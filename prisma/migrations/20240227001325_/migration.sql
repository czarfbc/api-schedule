/*
  Warnings:

  - Made the column `phone` on table `Schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "user_id" SET DEFAULT '';
