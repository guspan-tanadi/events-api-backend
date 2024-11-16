/*
  Warnings:

  - A unique constraint covering the columns `[registration_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration_id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "minpro"."Event" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "minpro"."Registration" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "minpro"."User" ADD COLUMN     "oauth_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_registration_id_key" ON "minpro"."Payment"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_registration_id_key" ON "minpro"."Review"("registration_id");
