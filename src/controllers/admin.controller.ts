import { Response, Request } from "express";
import { AdminService } from "../services/admin.service";
import { Event } from "../models/models";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  //CRUD admin event----------------------------------------------------------------

  async getAllEvents(req: Request, res: Response) {
    const events = await this.adminService.getAllEvents();
    if (events) {
      res.status(200).send({
        message: "Events retrieved",
        status: res.statusCode,
        data: events,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve events",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getEventById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const event = await this.adminService.getEventById(id);
    if (event) {
      res.status(200).send({
        message: `event id: ${id} was found`,
        status: res.statusCode,
        data: event,
      });
    } else {
      res.status(404).send({
        message: `No event with id: ${id} was found`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const {
        event_title,
        description,
        category,
        price,
        discounted_price,
        is_free,
        date,
        time,
        location,
        seat_quantity
      } = req.body;   

      // console.log(req.body);

      const image = (req as any).file?.path || "";

      const newEvent: Event = {
        event_title: event_title,
        description: description,
        category: category,
        price: Number(price),
        discounted_price: Number(discounted_price),
        is_free: is_free === "true",
        date: date,
        time: time,
        location: location,
        seat_quantity: Number(seat_quantity),
        image_url: String(image),
      };
      
      const createdEvent = await this.adminService.createEvent(newEvent);

      res.status(201).send({
        message: "Event created successfully",
        status: res.statusCode,
        data: createdEvent,
      });
    } catch (error: any) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).send({
          message: "File size exceeds 2 MB limit",
        });
      }
      res.status(400).send({
        message: `Failed to create event`,
        detail: error.errors,
        status: res.statusCode,
      });
    }
  }

  async updateEvent(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updatedEvent = await this.adminService.updateEvent(id, req.body);
    if (updatedEvent) {
      res.status(201).send({
        message: "Event updated successfully",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to updated event",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const deletedEvent = await this.adminService.deleteEvent(id);
    if (deletedEvent) {
      res.status(200).send({
        message: "Event deleted successfully",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to deleted event",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  //CRUD admin discount----------------------------------------------------------------
  async getAllDiscounts(req: Request, res: Response) {
    const discounts = await this.adminService.getAllDiscount();
    if (discounts) {
      res.status(200).send({
        message: "Discounts retrieved",
        status: res.statusCode,
        data: discounts,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve discounts",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async applyDiscount(req: Request, res: Response) {
    const createDiscount = await this.adminService.applyDiscount(req.body);
    if (createDiscount) {
      res.status(201).send({
        message: "Discount created successfully",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to create discount",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async updateDiscount(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updatedDiscount = await this.adminService.updateDiscount(
      req.body,
      id
    );
    if (updatedDiscount) {
      res.status(201).send({
        message: "Discount updated successfully",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to updated discount",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async deleteDiscount(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const deletedDiscount = await this.adminService.deleteDiscount(id);
    if (deletedDiscount) {
      res.status(200).send({
        message: "Discount deleted successfully",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to deleted discount",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  //get stats----------------------------------------------------------------

  async getAllUsers(req: Request, res: Response){
    const users = await this.adminService.getAllUsers();
    if (users) {
      res.status(200).send({
        message: "users retrieved",
        status: res.statusCode,
        data: users,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve users",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getAllRegistration(req: Request, res: Response) {
    const registrations = await this.adminService.getAllRegistration();
    if (registrations) {
      res.status(200).send({
        message: "Registrations retrieved",
        status: res.statusCode,
        data: registrations,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve registrations",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getAllPayments(req: Request, res: Response) {
    const payments = await this.adminService.getAllPayments();
    if (payments) {
      res.status(200).send({
        message: "Payments retrieved",
        status: res.statusCode,
        data: payments,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve payments",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getAllRegisByEventId(req: Request, res: Response) {
    const eventId = parseInt(req.params.id);
    const regisByEventId = await this.adminService.getEventAttendee(eventId);
    if (regisByEventId) {
      res.status(200).send({
        message: `All attendees for event id: ${eventId} retrieved`,
        status: res.statusCode,
        data: regisByEventId,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve attendees",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }
}
