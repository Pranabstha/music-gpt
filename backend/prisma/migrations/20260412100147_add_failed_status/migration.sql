/*
  Warnings:

  - You are about to drop the column `duration` on the `audios` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `audios` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `audios` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `audios` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `prompts` table. All the data in the column will be lost.
  - Added the required column `title` to the `audios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audios" DROP COLUMN "duration",
DROP COLUMN "fileSize",
DROP COLUMN "format",
DROP COLUMN "status",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "language";

-- DropEnum
DROP TYPE "AudioStatus";

-- CreateIndex
CREATE INDEX "audios_userId_idx" ON "audios"("userId");

-- CreateIndex
CREATE INDEX "prompts_userId_idx" ON "prompts"("userId");

-- CreateIndex
CREATE INDEX "prompts_status_idx" ON "prompts"("status");
