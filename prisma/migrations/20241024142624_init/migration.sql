-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "minpro";

-- CreateEnum
CREATE TYPE "minpro"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "minpro"."Category" AS ENUM ('MUSIC', 'SPORTS', 'EDUCATION', 'TECHNOLOGY');

-- CreateEnum
CREATE TYPE "minpro"."RegistrationStatus" AS ENUM ('REGISTERED', 'ATTENDED');

-- CreateEnum
CREATE TYPE "minpro"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "minpro"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'QRIS', 'BANK_TRANSFER');

-- CreateTable
CREATE TABLE "minpro"."User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "fullname" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "minpro"."Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "minpro"."Event" (
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "minpro"."Registration" (
    "registration_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registration_status" "minpro"."RegistrationStatus" NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("registration_id")
);

-- CreateTable
CREATE TABLE "minpro"."Payment" (
    "payment_id" SERIAL NOT NULL,
    "registration_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_status" "minpro"."PaymentStatus" NOT NULL,
    "payment_method" "minpro"."PaymentMethod" NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "minpro"."Review" (
    "review_id" SERIAL NOT NULL,
    "registration_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "minpro"."Discount" (
    "discount_id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "discount_percentage" DECIMAL(10,2) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("discount_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "minpro"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "minpro"."User"("email");

-- AddForeignKey
ALTER TABLE "minpro"."Registration" ADD CONSTRAINT "Registration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "minpro"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Registration" ADD CONSTRAINT "Registration_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "minpro"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Payment" ADD CONSTRAINT "Payment_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "minpro"."Registration"("registration_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Review" ADD CONSTRAINT "Review_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "minpro"."Registration"("registration_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "minpro"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minpro"."Discount" ADD CONSTRAINT "Discount_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "minpro"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
