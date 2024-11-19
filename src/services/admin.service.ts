import { PrismaClient } from "@prisma/client";
import { Event, Discount } from "../models/models";
import { discountSchema, eventSchema } from "../validator/event.validator";

import cloudinary from "../config/cloudinary";

export class AdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  //CRUD admin event----------------------------------------------------------------
  async getAllEvents() {
    return this.prisma.events.findMany();
  }

  async getEventById(event_id: number) {
    return this.prisma.events.findUnique({
      where: {
        event_id,
      },
    });
  }

  async createEvent(data: Event) {
    const validatedData = eventSchema.parse(data);
    const uploadResponse = await cloudinary.uploader.upload(data.image_url, {
      folder: "events",
    });

    if (data.price <= 0) {
      data.is_free = true;
    }

    return this.prisma.events.create({
      data: {
        event_title: validatedData.event_title,
        description: validatedData.description,
        category: validatedData.category,
        price: data.price,
        discounted_price: data.discounted_price,
        is_free: data.is_free,
        date: new Date(validatedData.date),
        time: new Date(validatedData.time),
        location: validatedData.location,
        seat_quantity: validatedData.seat_quantity,
        image_url: uploadResponse.secure_url,
      },
    });
  }

  async updateEvent(event_id: number, data: Event) {
    const validatedData = eventSchema.parse(data);
    let discountedPrice = 0;

    if (data.price <= 0) {
      data.is_free = true;
    }
    if (data.is_free) {
      await this.prisma.discounts.deleteMany({
        where: { event_id: event_id },
      });
    } else {
      const discountData = await this.prisma.discounts.findMany({
        where: { event_id: event_id },
        select: { discount_percentage: true },
      });
      const discountPercentage =
        Number(discountData[0]?.discount_percentage) ?? 0;

      discountedPrice =
        data.discounted_price ??
        (data.price && discountPercentage
          ? data.price * (1 - discountPercentage / 100)
          : 0.0);
    }

    //const discountedPrice = data.price * (1 - discountPercentage / 100)

    return this.prisma.events.update({
      where: { event_id },
      data: {
        event_title: validatedData.event_title,
        description: validatedData.description,
        category: validatedData.category,
        price: data.price,
        discounted_price: discountedPrice,
        is_free: data.is_free,
        date: new Date(validatedData.date),
        time: new Date(validatedData.time),
        location: validatedData.location,
        seat_quantity: validatedData.seat_quantity,
        image_url: data.image_url,
      },
    });
  }

  async deleteEvent(event_id: number) {
    await this.prisma.reviews.deleteMany({
      where: {
        Registration: {
          event_id: event_id
        }
      }
    })
    await this.prisma.payments.deleteMany({
      where: {
        Registration: {
          event_id: event_id
        }
      }
    })
    await this.prisma.registrations.deleteMany({
      where: {event_id: event_id}
    })

    await this.prisma.discounts.deleteMany({
      where: { event_id },
    });

    return this.prisma.events.delete({
      where: { event_id },
    });
  }

  //CRUD admin discount----------------------------------------------------------------
  async getAllDiscount() {
    return this.prisma.discounts.findMany();
  }

  async applyDiscount(data: Discount) {
    const validateData = discountSchema.parse(data);
  
    if (new Date(validateData.end_date) < new Date(validateData.start_date)) {
      return {
        success: false,
        message: "End date cannot be before start date.",
      };
    }
  
    const event = await this.prisma.events.findUnique({
      where: {
        event_id: data.event_id,
      },
    });
    const discountedPrice = Number(event?.price) * (1 - data.discount_percentage / 100);

    await this.prisma.events.update({
      where: {
        event_id: data.event_id,
      },
      data: {
        discounted_price: discountedPrice,
      },
    });
  
    const discountRecord = await this.prisma.discounts.create({
      data: {
        event_id: validateData.event_id,
        discount_percentage: validateData.discount_percentage,
        start_date: validateData.start_date,
        end_date: validateData.end_date,
      },
    });
  
    return {
      success: true,
      message: "Discount applied successfully.",
      discount: discountRecord,
    };
  }
  

  async updateDiscount(data: Discount, discountId: number) {
    const event = await this.prisma.events.findUnique({
      where: {
        event_id: data.event_id,
      },
    });
    const discountedPrice =
      Number(event?.price) * (1 - data.discount_percentage / 100);
    await this.prisma.events.update({
      where: {
        event_id: data.event_id,
      },
      data: {
        discounted_price: discountedPrice,
      },
    });
    return this.prisma.discounts.update({
      where: {
        discount_id: discountId,
      },
      data,
    });
  }

  async deleteDiscount(discountId: number) {
    const discount = await this.prisma.discounts.findUnique({
      where: {
        discount_id: discountId,
      },
    });
    const event = await this.prisma.events.findUnique({
      where: {
        event_id: discount?.event_id,
      },
    });
    const discountedPrice = 0;
    await this.prisma.events.update({
      where: {
        event_id: event?.event_id,
      },
      data: {
        discounted_price: discountedPrice,
      },
    });
    return this.prisma.discounts.delete({
      where: {
        discount_id: discountId,
      },
    });
  }

  //get stats----------------------------------------------------------------

  async getAllUsers() {
    return this.prisma.users.findMany({
      orderBy: {
        user_id: "asc",
      },
    });
  }

  async getAllRegistration() {
    return this.prisma.registrations.findMany({
      include: {
        User: {
          select: {
            email: true,
          },
        },
        Event: {
          select: {
            event_title: true,
          },
        },
      },
    });
  }

  async getAllPayments() {
    return this.prisma.payments.findMany({
      include: {
        Registration: {
          include: {
            User: {
              select: {
                email: true,
              },
            },
            Event: {
              select: {
                event_title: true,
              },
            },
          },
        },
      },
    });
  }

  async getEventAttendee(event_id: number) {
    return this.prisma.registrations.findMany({
      where: {
        event_id: event_id,
      },
    });
  }
}
