-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
