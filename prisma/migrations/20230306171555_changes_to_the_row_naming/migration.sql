/*
  Warnings:

  - You are about to drop the column `image_url` on the `badges` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `mood_description` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `audio_length` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `audio_url` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `users` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `badges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moodDescription` to the `journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audioUrl` to the `tracks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "badges" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "goals" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "journals" DROP COLUMN "mood_description",
ADD COLUMN     "moodDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "audio_length",
DROP COLUMN "audio_url",
DROP COLUMN "image_url",
ADD COLUMN     "audioLength" TEXT,
ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_url",
ADD COLUMN     "avatarUrl" TEXT;
