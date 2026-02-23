/*
  Warnings:

  - You are about to drop the column `isCanceled` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `isHalfRequired` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `studentNumber` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,subjectId,testNumber]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[attendanceNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attendanceNo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleAdjustment" DROP CONSTRAINT "ScheduleAdjustment_subjectId_fkey";

-- DropIndex
DROP INDEX "User_studentNumber_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "isCanceled",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "isHalfRequired",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isHalfCourse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "studentNumber",
ADD COLUMN     "attendanceNo" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SubjectReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "reportScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SubjectReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectReport_userId_subjectId_key" ON "SubjectReport"("userId", "subjectId");

-- CreateIndex
CREATE INDEX "Attendance_userId_subjectId_idx" ON "Attendance"("userId", "subjectId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "Grade_userId_subjectId_idx" ON "Grade"("userId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_userId_subjectId_testNumber_key" ON "Grade"("userId", "subjectId", "testNumber");

-- CreateIndex
CREATE INDEX "ScheduleAdjustment_subjectId_idx" ON "ScheduleAdjustment"("subjectId");

-- CreateIndex
CREATE INDEX "ScheduleAdjustment_date_idx" ON "ScheduleAdjustment"("date");

-- CreateIndex
CREATE INDEX "Subject_weekday_period_idx" ON "Subject"("weekday", "period");

-- CreateIndex
CREATE UNIQUE INDEX "User_attendanceNo_key" ON "User"("attendanceNo");

-- CreateIndex
CREATE INDEX "User_attendanceNo_idx" ON "User"("attendanceNo");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectReport" ADD CONSTRAINT "SubjectReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectReport" ADD CONSTRAINT "SubjectReport_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleAdjustment" ADD CONSTRAINT "ScheduleAdjustment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
