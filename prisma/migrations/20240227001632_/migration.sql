/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_user_id_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
