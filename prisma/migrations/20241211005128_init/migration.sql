/*
  Warnings:

  - You are about to drop the `CheckpointAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckpointRules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Concept` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Explanation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mistake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prerequisite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConceptToTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DependencyToTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LevelToTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MistakeToTopic` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CheckpointAttempt" DROP CONSTRAINT "CheckpointAttempt_levelId_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointAttempt" DROP CONSTRAINT "CheckpointAttempt_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Explanation" DROP CONSTRAINT "Explanation_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Prerequisite" DROP CONSTRAINT "Prerequisite_topic_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ConceptToTopic" DROP CONSTRAINT "_ConceptToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConceptToTopic" DROP CONSTRAINT "_ConceptToTopic_B_fkey";

-- DropForeignKey
ALTER TABLE "_DependencyToTopic" DROP CONSTRAINT "_DependencyToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_DependencyToTopic" DROP CONSTRAINT "_DependencyToTopic_B_fkey";

-- DropForeignKey
ALTER TABLE "_LevelToTopic" DROP CONSTRAINT "_LevelToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_LevelToTopic" DROP CONSTRAINT "_LevelToTopic_B_fkey";

-- DropForeignKey
ALTER TABLE "_MistakeToTopic" DROP CONSTRAINT "_MistakeToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_MistakeToTopic" DROP CONSTRAINT "_MistakeToTopic_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarId" TEXT,
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "CheckpointAttempt";

-- DropTable
DROP TABLE "CheckpointRules";

-- DropTable
DROP TABLE "Concept";

-- DropTable
DROP TABLE "Example";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "Explanation";

-- DropTable
DROP TABLE "Level";

-- DropTable
DROP TABLE "Mistake";

-- DropTable
DROP TABLE "Prerequisite";

-- DropTable
DROP TABLE "Progress";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Topic";

-- DropTable
DROP TABLE "_ConceptToTopic";

-- DropTable
DROP TABLE "_DependencyToTopic";

-- DropTable
DROP TABLE "_LevelToTopic";

-- DropTable
DROP TABLE "_MistakeToTopic";

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentLevel" TEXT NOT NULL DEFAULT 'Beginner',
    "xpPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
