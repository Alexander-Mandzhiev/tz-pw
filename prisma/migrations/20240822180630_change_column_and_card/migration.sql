/*
  Warnings:

  - You are about to drop the column `name` on the `columns` table. All the data in the column will be lost.
  - Added the required column `text` to the `cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `columns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "columns" DROP COLUMN "name",
ADD COLUMN     "title" VARCHAR(150) NOT NULL;
