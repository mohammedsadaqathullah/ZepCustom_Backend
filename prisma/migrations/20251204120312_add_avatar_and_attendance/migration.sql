-- AlterTable: Rename passwordHash to password
ALTER TABLE "User" RENAME COLUMN "passwordHash" TO "password";

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='avatarConfig') THEN
        ALTER TABLE "User" ADD COLUMN "avatarConfig" JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='isOnline') THEN
        ALTER TABLE "User" ADD COLUMN "isOnline" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='currentSpaceId') THEN
        ALTER TABLE "User" ADD COLUMN "currentSpaceId" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='lastSeen') THEN
        ALTER TABLE "User" ADD COLUMN "lastSeen" TIMESTAMP(3);
    END IF;
END $$;

-- CreateTable: Attendance
CREATE TABLE IF NOT EXISTS "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOutTime" TIMESTAMP(3),
    "duration" INTEGER,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Attendance_userId_idx" ON "Attendance"("userId");
CREATE INDEX IF NOT EXISTS "Attendance_spaceId_idx" ON "Attendance"("spaceId");
CREATE INDEX IF NOT EXISTS "Attendance_date_idx" ON "Attendance"("date");
CREATE UNIQUE INDEX IF NOT EXISTS "Attendance_userId_date_key" ON "Attendance"("userId", "date");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Attendance_userId_fkey'
    ) THEN
        ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Attendance_spaceId_fkey'
    ) THEN
        ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
