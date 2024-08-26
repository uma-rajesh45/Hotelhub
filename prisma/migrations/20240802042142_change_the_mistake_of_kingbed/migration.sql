/*
  Warnings:

  - You are about to drop the column `kindbed` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "kindbed",
ADD COLUMN     "kingbed" INTEGER NOT NULL DEFAULT 0;
