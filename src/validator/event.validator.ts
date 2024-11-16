import { z as validate } from "zod";

const PaymentMethodEnum = ["CREDIT_CARD", "QRIS", "BANK_TRANSFER"] as const;

export const eventSchema = validate.object({
  event_title: validate.string().min(1, "Event title is required"),
  description: validate.string().min(1, "Description is required"),
  category: validate.enum(["MUSIC", "SPORTS", "EDUCATION", "TECHNOLOGY"]),

  date: validate.string().min(1, "Date is required"),
  time: validate.string().min(1, "Time is required"),
  location: validate.string().min(1, "Location is required"),
  seat_quantity: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > 0, {
      message: "Seat quantity must be greater than 0",
    }),
});

export const discountSchema = validate.object({
  event_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > -1, {
      message: "You have to pick an event",
    }),
  discount_percentage: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > 0, {
      message: "Discount percentage must be greater than 0",
    }),
  start_date: validate.string().min(1, "Start date is required"),
  end_date: validate.string().min(1, "End date is required"),
});

export const registerSchema = validate.object({
  event_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > -1, {
      message: "You have to pick an event",
    }),
  user_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > -1, {
      message: "You have to have a user ID",
    }),
  quantity: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val >= 1 && val <= 5, {
      message: "Quantity must be between 1 and 5",
    }),
});

export const paymentSchema = validate.object({
  registration_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > -1, {
      message: "Registration ID can't be empty",
    }),
  payment_method: validate
    .enum(PaymentMethodEnum)
    .refine((val) => PaymentMethodEnum.includes(val), {
      message:
        "Payment method must be one of: CREDIT_CARD, QRIS, or BANK_TRANSFER",
    }),
});

export const reviewSchema = validate.object({
  registration_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > -1, {
      message: "Registration ID can't be empty",
    }),
  user_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > -1, {
      message: "You have to have a user ID",
    }),
  rating: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
  comment: validate
    .string()
    .min(1, "Comment cannot be empty")
    .max(256, "Comment can't exceed 256 characters"),
});
