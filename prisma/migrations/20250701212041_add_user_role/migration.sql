-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FARMER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FARMER';
