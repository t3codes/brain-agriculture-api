/*
  Warnings:

  - You are about to drop the `FarmCrop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Harvest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `farmId` to the `Crop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FarmCrop" DROP CONSTRAINT "FarmCrop_cropId_fkey";

-- DropForeignKey
ALTER TABLE "FarmCrop" DROP CONSTRAINT "FarmCrop_farmId_fkey";

-- DropForeignKey
ALTER TABLE "FarmCrop" DROP CONSTRAINT "FarmCrop_harvestId_fkey";

-- AlterTable
ALTER TABLE "Crop" ADD COLUMN     "farmId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "FarmCrop";

-- DropTable
DROP TABLE "Harvest";

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
