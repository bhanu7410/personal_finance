/*
  Warnings:

  - You are about to drop the column `upid` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upi_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_upid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "upid",
ADD COLUMN     "upi_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_upi_id_key" ON "User"("upi_id");
