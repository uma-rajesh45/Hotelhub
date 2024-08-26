/*
  Warnings:

  - You are about to drop the column `loacationdescription` on the `Hotel` table. All the data in the column will be lost.
  - Added the required column `locationdescription` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "loacationdescription",
ADD COLUMN     "locationdescription" TEXT NOT NULL;
