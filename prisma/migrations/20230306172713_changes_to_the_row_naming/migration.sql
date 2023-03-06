/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Meditations` table. All the data in the column will be lost.
  - You are about to drop the column `to_improve` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `pomodoro_timers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `pomodoro_timers` table. All the data in the column will be lost.
  - Added the required column `toImprove` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meditations" DROP COLUMN "createdAt",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "journals" DROP COLUMN "to_improve",
ADD COLUMN     "toImprove" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pomodoro_timers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
