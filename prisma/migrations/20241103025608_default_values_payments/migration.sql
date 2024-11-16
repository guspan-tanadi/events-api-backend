-- AlterTable
ALTER TABLE "minpro"."Payments" ALTER COLUMN "payment_status" SET DEFAULT 'PENDING',
ALTER COLUMN "payment_method" SET DEFAULT 'QRIS',
ALTER COLUMN "payment_date" DROP NOT NULL,
ALTER COLUMN "payment_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "minpro"."Users" ALTER COLUMN "password" SET DATA TYPE TEXT;
