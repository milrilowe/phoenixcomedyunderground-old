/*
  Warnings:

  - You are about to drop the column `name` on the `Message` table. All the data in the column will be lost.
  - Added the required column `subject` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN "subject" TEXT;
UPDATE "Message" SET "subject" = "name";
ALTER TABLE "Message" ALTER COLUMN "subject" SET NOT NULL;
ALTER TABLE "Message" DROP COLUMN "name";

