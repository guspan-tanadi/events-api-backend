import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getEvents(req: Request, res: Response) {
    const { search, category, location } = req.query;
    const events = await this.userService.getEvents(
      search as string,
      category as string,
      location as string
    );
    if (events) {
      res.status(200).send({
        data: events,
        message: "events successfully retrieved",
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Failed to retrieve events",
        status: res.statusCode,
      });
    }
  }

  async getEventById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const event = await this.userService.getEventById(id);
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

  async getUserById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await this.userService.getUserById(id);
    if (user) {
      res.status(200).send({
        message: `user id: ${id} was found`,
        status: res.statusCode,
        data: user,
      });
    } else {
      res.status(404).send({
        message: `No user with id: ${id} was found`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async registerEvent(req: Request, res: Response) {
    try {
      const { user_id, event_id, quantity } = req.body;
      const eventRegistration = await this.userService.registerEvent(
        user_id,
        event_id,
        quantity
      );
      res.status(201).send({
        message: "Event registered successfully",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message || "Failed to register for event";
      const statusCode =
        errorMessage === "Cannot register for past events" ||
        errorMessage === "Not enough seats available"
          ? 400
          : 500;
      res.status(statusCode).send({
        message: errorMessage,
        status: statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getRegistrationByUserId(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const event = await this.userService.getRegistrationByUserId(id);
    if (event) {
      res.status(200).send({
        message: `Registrations for user id: ${id} was found`,
        status: res.statusCode,
        data: event,
      });
    } else {
      res.status(404).send({
        message: `No registration for user id: ${id} was found`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async payRegistration(req: Request, res: Response) {
    try {
      const { registration_id, payment_method } = req.body;
      const payment = await this.userService.payRegistration(
        registration_id,
        payment_method
      );
      res.status(201).send({
        message: "Payment Successfull",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message || "Failed to update Payment";
      res.status(400).send({
        message: errorMessage,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async attendEventByRegisId(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const registration = await this.userService.attendEventByRegisId(id);
    if (registration) {
      res.status(201).send({
        message: `Registration ID: ${id} status has change to attended`,
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to update Registration",
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getReviewsByEventId(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const reviews = await this.userService.getReviewsByEventId(id);
    if (reviews) {
      res.status(200).send({
        message: `Reviews for event id: ${id} was found`,
        status: res.statusCode,
        data: reviews,
      });
    } else {
      res.status(404).send({
        message: `No reviews for event id ${id} was found`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  //mungkin ini service ga dipake
  async getReviewsByUserId(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const reviews = await this.userService.getReviewsByUserId(id);
    if (reviews) {
      res.status(200).send({
        message: `Reviews for user id: ${id} was found`,
        status: res.statusCode,
        data: reviews,
      });
    } else {
      res.status(404).send({
        message: `No reviews for user id ${id} was found`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async reviewEvent(req: Request, res: Response) {
    const { registration_id, user_id, rating, comment } = req.body;
    try {
      const review = await this.userService.reviewEvent(
        registration_id,
        user_id,
        rating,
        comment
      );
      res.status(201).send({
        message: "Review has been created",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      if (err.message === "You have already reviewed this event.") {
        res.status(400).send({
          message: err.message,
          status: res.statusCode,
        });
      } else {
        const errorMessage = err.message || "Failed to create review";
        res.status(400).send({
          message: errorMessage,
          status: res.statusCode,
          detail: res.statusMessage,
        });
      }
    }
  }

  async getDiscountByEventId(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const discount = await this.userService.getDiscountByEventId(id);
    if (discount) {
      res.status(201).send({
        message: `Discount for event id ${id} was found`,
        status: res.statusCode,
        data: discount,
      });
    } else {
      res.status(404).send({
        message: `No discount found for event id ${id}`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    }
  }

  async getAllDiscounts(req: Request, res: Response) {
    const discounts = await this.userService.getAllDiscounts();
    if (discounts) {
      res.status(200).send({
        message: "discounts retrieved",
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
}
