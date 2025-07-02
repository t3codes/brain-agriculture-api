/*
  Warnings:

  - Added the required column `harvestYear` to the `Crop` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Crop_name_key";

-- AlterTable
ALTER TABLE "Crop" ADD COLUMN     "harvestDate" TIMESTAMP(3),
ADD COLUMN     "harvestYear" INTEGER NOT NULL,
ADD COLUMN     "plantingDate" TIMESTAMP(3),
ADD COLUMN     "variety" TEXT,
ADD COLUMN     "yield" DOUBLE PRECISION;
