/*
  Warnings:

  - A unique constraint covering the columns `[refreshtoken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accesstoken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accesstoken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshtoken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accesstoken" TEXT NOT NULL,
ADD COLUMN     "refreshtoken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshtoken_key" ON "User"("refreshtoken");

-- CreateIndex
CREATE UNIQUE INDEX "User_accesstoken_key" ON "User"("accesstoken");
