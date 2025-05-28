/*
  Warnings:

  - You are about to drop the column `icon` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "icon",
DROP COLUMN "isActive";
