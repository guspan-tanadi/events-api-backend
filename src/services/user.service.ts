/* 
Functions for a user
- getEvents X
- getEventById X
- getUserById 
- registerEvent X
- getRegistrationByUserId X
- payRegistration X
- reviewEvent X
- getReviewsByEventId X
- getReviewsByUserId X
- getDiscountByEventId X
- getAllDiscounts X
- attendRegistration
*/

import { Category, PaymentMethod, PrismaClient } from "@prisma/client";
import { registerSchema, paymentSchema, reviewSchema } from "../validator/event.validator";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getEvents(
    search: string = "",
    category: string = "",
    location: string = ""
  ) {
    return this.prisma.events.findMany({
      where: {
        event_title: {
          contains: search,
          mode: "insensitive",
        },
        category: category ? (category as Category) : undefined,
        location: {
          contains: location,
          mode: "insensitive",
        },
      }
    });
  }

  async getEventById(eventId: number) {
    return this.prisma.events.findUnique({
      where: {
        event_id: eventId,
      },
    });
  }

  async getUserById(userId: number) {
    return this.prisma.users.findUnique({
      where: {
        user_id: userId,
      },
    });
  }

  async registerEvent(user_id: number, event_id: number, quantity: number) {

    try {
      registerSchema.parse({ user_id, event_id, quantity });
    } catch (error) {
      const err = error as Error
      return Promise.reject(new Error(`Validation error: ${err.message}`));
    }
    const event = await this.prisma.events.findUnique({
      where: { event_id },
    });

    if (!event) {
      return Promise.reject(new Error("Event not found"));
    }

    const eventDate = new Date(event.date);
    const dateNow = new Date();
    if(eventDate < dateNow){
      return Promise.reject(new Error("Cannot register for past events"));
    }

    let amount = 0;

    if (
      event.is_free ||
      (event.price.toNumber() === 0 && event.discounted_price.toNumber() === 0)
    ) {
      amount = quantity * 0;
    } else {
      const discount = await this.prisma.discounts.findMany({
        where: {
          event_id: event_id,
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
      });
      if (discount.length > 0 && event.discounted_price.toNumber() > 0) {
        amount = quantity * event.discounted_price.toNumber();
      } else {
        amount = quantity * event.price.toNumber();
      }
    }

    if (event.seat_quantity < quantity) {
      return Promise.reject(new Error("Not enough seat available"));
    }

    const registration = await this.prisma.registrations.create({
      data: {
        user_id,
        event_id,
        quantity: Number(quantity),
        registration_status: "REGISTERED",
      },
    });

    await this.prisma.events.update({
      where: { event_id },
      data: {
        seat_quantity: { decrement: Number(quantity) },
      },
    });

    return await this.prisma.payments.create({
      data: {
        registration_id: registration.registration_id,
        amount,
        payment_status: "PENDING",
        payment_method: "QRIS",
      },
    });
  }

  async getRegistrationByUserId(user_id: number) {
    return await this.prisma.registrations.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        Payments: {
          select: {
            amount: true,
            payment_status: true,
            payment_method: true,
          },
        },
        Event: {
          select: {
            event_title: true,
            date: true,
            location: true,
          },
        },
      },
    });
  }

  async payRegistration(
    registration_id: number,
    payment_method: PaymentMethod
  ) {
    try {
      paymentSchema.parse({ registration_id, payment_method });
    } catch (error) {
      const err = error as Error
      return Promise.reject(new Error(`Validation error: ${err.message}`));
    }
    return await this.prisma.payments.update({
      where: {
        registration_id,
      },
      data: {
        payment_status: "COMPLETED",
        payment_method: payment_method,
        payment_date: new Date(),
      },
    });
  }

  async attendEventByRegisId(registration_id: number) {
    return await this.prisma.registrations.update({
      where: {
        registration_id,
      },
      data: {
        registration_status: "ATTENDED",
      },
    });
  }

  async reviewEvent(
    registration_id: number,
    user_id: number,
    rating: number,
    comment: string
  ) {
    try {
      reviewSchema.parse({registration_id, user_id, rating, comment});
    } catch (error) {
      const err = error as Error
      return Promise.reject(new Error(`Validation error: ${err.message}`));
    }
    const existingReview = await this.prisma.reviews.findFirst({
      where: {
        registration_id: registration_id,
        user_id: user_id
      }
    })

    if (existingReview) {
      throw new Error("You have already reviewed this event.");
    }

    return await this.prisma.reviews.create({
      data: {
        registration_id,
        user_id,
        rating,
        comment,
      },
    });
  }

  async getReviewsByEventId(event_id: number) {
    return await this.prisma.reviews.findMany({
      where: {
        Registration: {
          event_id: event_id,
        },
      },
      include: {
       User: {
        select: {
          username: true
        }
       }
      },
    });
  }

  async getReviewsByUserId(user_id: number) {
    return await this.prisma.reviews.findMany({
      where: { user_id },
    });
  }

  async getDiscountByEventId(event_id: number) {
    return await this.prisma.discounts.findMany({
      where: {
        event_id: event_id,
      },
    });
  }

  async getAllDiscounts() {
    return await this.prisma.discounts.findMany();
  }
}
