/*
  Warnings:

  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Registration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "minpro"."Discount" DROP CONSTRAINT "Discount_event_id_fkey";

-- DropForeignKey
ALTER TABLE "minpro"."Payment" DROP CONSTRAINT "Payment_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "minpro"."Registration" DROP CONSTRAINT "Registration_event_id_fkey";

-- DropForeignKey
ALTER TABLE "minpro"."Registration" DROP CONSTRAINT "Registration_user_id_fkey";

-- DropForeignKey
ALTER TABLE "minpro"."Review" DROP CONSTRAINT "Review_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "minpro"."Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropTable
DROP TABLE "minpro"."Discount";

-- DropTable
DROP TABLE "minpro"."Event";

-- DropTable
DROP TABLE "minpro"."Payment";

-- DropTable
DROP TABLE "minpro"."Registration";

-- DropTable
DROP TABLE "minpro"."Review";

-- DropTable
DROP TABLE "minpro"."User";

-- CreateTable
CREATE TABLE "minpro"."Users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "fullname" VARCHAR(50) NOT NULL,
    "role" "minpro"."Role" NOT NULL,
    "refresh_token" TEXT,
    "oauth_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "minpro"."Events" (
    "event_id" SERIAL NOT NULL,
    "event_title" VARCHAR(32) NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "category" "minpro"."Category" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discounted_price" DECIMAL(10,2) NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(256) NOT NULL,
    "seat_quantity" INTEGER NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "minpro"."Registrations" (
    "registration_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registration_status" "minpro"."RegistrationStatus" NOT NULL,

    CONSTRAINT "Registrations_pkey" PRIMARY KEY ("registration_id")
);

-- CreateTable
CREATE TABLE "minpro"."Payments" (
    "payment_id" SERIAL NOT NULL,
    "registration_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_status" "minpro"."PaymentStatus" NOT NULL,
    "payment_method" "minpro"."PaymentMethod" NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "minpro"."Reviews" (
    "review_id" SERIAL NOT NULL,
    "registration_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "minpro"."Discounts" (
    "discount_id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "discount_percentage" DECIMAL(10,2) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discounts_pkey" PRIMARY KEY ("discount_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "minpro"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "minpro"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_registration_id_key" ON "minpro"."Payments"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_registration_id_key" ON "minpro"."Reviews"("registration_id");

-- AddForeignKey
ALTER TABLE "minpro"."Registrations" ADD CONSTRAINT "Registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "minpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Registrations" ADD CONSTRAINT "Registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "minpro"."Events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Payments" ADD CONSTRAINT "Payments_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "minpro"."Registrations"("registration_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Reviews" ADD CONSTRAINT "Reviews_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "minpro"."Registrations"("registration_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "minpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Discounts" ADD CONSTRAINT "Discounts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "minpro"."Events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
