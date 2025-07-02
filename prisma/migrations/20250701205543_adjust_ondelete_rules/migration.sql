-- DropForeignKey
ALTER TABLE "Crop" DROP CONSTRAINT "Crop_farmId_fkey";

-- DropForeignKey
ALTER TABLE "Farm" DROP CONSTRAINT "Farm_producerId_fkey";

-- DropForeignKey
ALTER TABLE "Producer" DROP CONSTRAINT "Producer_userId_fkey";

-- AlterTable
ALTER TABLE "Producer" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Producer" ADD CONSTRAINT "Producer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
