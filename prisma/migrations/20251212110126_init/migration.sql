/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,spaceId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Attendance_userId_date_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_spaceId_date_key" ON "Attendance"("userId", "spaceId", "date");
