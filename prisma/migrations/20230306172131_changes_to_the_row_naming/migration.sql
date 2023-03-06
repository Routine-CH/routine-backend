/*
  Warnings:

  - You are about to drop the column `planned_date` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `login_date` on the `user_logins` table. All the data in the column will be lost.
  - Added the required column `plannedDate` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "planned_date",
ADD COLUMN     "plannedDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_logins" DROP COLUMN "login_date",
ADD COLUMN     "loginDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
