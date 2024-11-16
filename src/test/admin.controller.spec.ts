import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { Request, Response } from 'express';

jest.mock('../services/admin.service');

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;
  let req: Partial<Request>;
  let res: Partial<Response & { statusCode?: number }>;

  beforeEach(() => {
    adminService = new AdminService();
    adminController = new AdminController();
    // Override the adminService instance in the controller with our mock
    (adminController as any).adminService = adminService;

    req = {};
    res = {
      statusCode: 200,
      status: jest.fn().mockImplementation((code) => {
        res.statusCode = code;
        return res as Response;
      }),
      send: jest.fn(),
    };
  });

  // getAllEvents
  describe('getAllEvents', () => {
    it('should retrieve all events and send a 200 response', async () => {
      const events = [{ event_id: 1, event_title: 'Event 1' }];
      adminService.getAllEvents = jest.fn().mockResolvedValue(events);

      await adminController.getAllEvents(req as Request, res as Response);

      expect(adminService.getAllEvents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Events retrieved',
        status: res.statusCode,
        data: events,
      });
    });

    it('should send a 404 response if events are not found', async () => {
      adminService.getAllEvents = jest.fn().mockResolvedValue(null);

      await adminController.getAllEvents(req as Request, res as Response);

      expect(adminService.getAllEvents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to retrieve events',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // getEventById
  describe('getEventById', () => {
    it('should retrieve an event by ID and send a 200 response', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };
      const event = { event_id: eventId, event_title: 'Event 1' };
      adminService.getEventById = jest.fn().mockResolvedValue(event);

      await adminController.getEventById(req as Request, res as Response);

      expect(adminService.getEventById).toHaveBeenCalledWith(eventId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: `event id: ${eventId} was found`,
        status: res.statusCode,
        data: event,
      });
    });

    it('should send a 404 response if the event is not found', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };
      adminService.getEventById = jest.fn().mockResolvedValue(null);

      await adminController.getEventById(req as Request, res as Response);

      expect(adminService.getEventById).toHaveBeenCalledWith(eventId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: `No event with id: ${eventId} was found`,
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // createEvent
  describe('createEvent', () => {
    it('should create an event and send a 201 response', async () => {
      const reqBody = {
        event_title: 'Event 1',
        description: 'Description 1',
        category: 'Category 1',
        price: '100',
        discounted_price: '80',
        is_free: 'false',
        date: '2023-01-01',
        time: '10:00:00',
        location: 'Location 1',
        seat_quantity: '100',
      };
      const reqFile = {
        path: '/path/to/image.jpg',
      };
      req.body = reqBody;
      (req as any).file = reqFile;

      const newEvent = {
        event_title: reqBody.event_title,
        description: reqBody.description,
        category: reqBody.category,
        price: Number(reqBody.price),
        discounted_price: Number(reqBody.discounted_price),
        is_free: reqBody.is_free === 'true',
        date: reqBody.date,
        time: reqBody.time,
        location: reqBody.location,
        seat_quantity: Number(reqBody.seat_quantity),
        image_url: String(reqFile.path),
      };

      const createdEvent = { event_id: 1, ...newEvent };

      adminService.createEvent = jest.fn().mockResolvedValue(createdEvent);

      await adminController.createEvent(req as Request, res as Response);

      expect(adminService.createEvent).toHaveBeenCalledWith(newEvent);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Event created successfully',
        status: res.statusCode,
        data: createdEvent,
      });
    });

    it('should send a 400 response if creation fails', async () => {
      const reqBody = {
        event_title: 'Event 1',
        description: 'Description 1',
        category: 'Category 1',
        price: '100',
        discounted_price: '80',
        is_free: 'false',
        date: '2023-01-01',
        time: '10:00:00',
        location: 'Location 1',
        seat_quantity: '100',
      };
      const reqFile = {
        path: '/path/to/image.jpg',
      };
      req.body = reqBody;
      (req as any).file = reqFile;

      const newEvent = {
        event_title: reqBody.event_title,
        description: reqBody.description,
        category: reqBody.category,
        price: Number(reqBody.price),
        discounted_price: Number(reqBody.discounted_price),
        is_free: reqBody.is_free === 'true',
        date: reqBody.date,
        time: reqBody.time,
        location: reqBody.location,
        seat_quantity: Number(reqBody.seat_quantity),
        image_url: String(reqFile.path),
      };

      const error = new Error('Creation failed');
      adminService.createEvent = jest.fn().mockRejectedValue(error);

      await adminController.createEvent(req as Request, res as Response);

      expect(adminService.createEvent).toHaveBeenCalledWith(newEvent);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to create event',
        detail: error.message,
        status: res.statusCode,
      });
    });

    it('should handle file size limit error', async () => {
      const reqBody = {
        event_title: 'Event 1',
        description: 'Description 1',
        category: 'Category 1',
        price: '100',
        discounted_price: '80',
        is_free: 'false',
        date: '2023-01-01',
        time: '10:00:00',
        location: 'Location 1',
        seat_quantity: '100',
      };
      const reqFile = {
        path: '/path/to/image.jpg',
      };
      req.body = reqBody;
      (req as any).file = reqFile;

      const newEvent = {
        event_title: reqBody.event_title,
        description: reqBody.description,
        category: reqBody.category,
        price: Number(reqBody.price),
        discounted_price: Number(reqBody.discounted_price),
        is_free: reqBody.is_free === 'true',
        date: reqBody.date,
        time: reqBody.time,
        location: reqBody.location,
        seat_quantity: Number(reqBody.seat_quantity),
        image_url: String(reqFile.path),
      };

    interface FileSizeError extends Error {
      code?: string;
    }

      const error: FileSizeError = new Error('File size limit exceeded');
      error.code = 'LIMIT_FILE_SIZE';
      adminService.createEvent = jest.fn().mockRejectedValue(error);

      await adminController.createEvent(req as Request, res as Response);

      expect(adminService.createEvent).toHaveBeenCalledWith(newEvent);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'File size exceeds 2 MB limit',
      });
    });
  });

  // updateEvent
  describe('updateEvent', () => {
    it('should update an event and send a 201 response', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };
      req.body = {
        event_title: 'Updated Event',
        // other event properties
      };

      adminService.updateEvent = jest.fn().mockResolvedValue(true);

      await adminController.updateEvent(req as Request, res as Response);

      expect(adminService.updateEvent).toHaveBeenCalledWith(eventId, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Event updated successfully',
        status: res.statusCode,
      });
    });

    it('should send a 400 response if update fails', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };
      req.body = {
        event_title: 'Updated Event',
        // other event properties
      };

      adminService.updateEvent = jest.fn().mockResolvedValue(null);

      await adminController.updateEvent(req as Request, res as Response);

      expect(adminService.updateEvent).toHaveBeenCalledWith(eventId, req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to updated event',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // deleteEvent
  describe('deleteEvent', () => {
    it('should delete an event and send a 200 response', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };

      adminService.deleteEvent = jest.fn().mockResolvedValue(true);

      await adminController.deleteEvent(req as Request, res as Response);

      expect(adminService.deleteEvent).toHaveBeenCalledWith(eventId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Event deleted successfully',
        status: res.statusCode,
      });
    });

    it('should send a 400 response if delete fails', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };

      adminService.deleteEvent = jest.fn().mockResolvedValue(null);

      await adminController.deleteEvent(req as Request, res as Response);

      expect(adminService.deleteEvent).toHaveBeenCalledWith(eventId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to deleted event',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // getAllDiscounts
  describe('getAllDiscounts', () => {
    it('should retrieve all discounts and send a 200 response', async () => {
      const discounts = [{ discount_id: 1, discount_percentage: 10 }];
      adminService.getAllDiscount = jest.fn().mockResolvedValue(discounts);

      await adminController.getAllDiscounts(req as Request, res as Response);

      expect(adminService.getAllDiscount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Discounts retrieved',
        status: res.statusCode,
        data: discounts,
      });
    });

    it('should send a 404 response if discounts are not found', async () => {
      adminService.getAllDiscount = jest.fn().mockResolvedValue(null);

      await adminController.getAllDiscounts(req as Request, res as Response);

      expect(adminService.getAllDiscount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to retrieve discounts',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // applyDiscount
  describe('applyDiscount', () => {
    it('should apply a discount and send a 201 response', async () => {
      req.body = {
        event_id: 1,
        discount_percentage: 10,
        start_date: '2023-01-01',
        end_date: '2023-02-01',
      };

      const discountResult = {
        success: true,
        message: 'Discount applied successfully.',
        discount: {
          discount_id: 1,
          event_id: 1,
          discount_percentage: 10,
          start_date: '2023-01-01',
          end_date: '2023-02-01',
        },
      };

      adminService.applyDiscount = jest.fn().mockResolvedValue(discountResult);

      await adminController.applyDiscount(req as Request, res as Response);

      expect(adminService.applyDiscount).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Discount created successfully',
        status: res.statusCode,
      });
    });

    it('should send a 400 response if applyDiscount fails', async () => {
      req.body = {
        event_id: 1,
        discount_percentage: 10,
        start_date: '2023-01-01',
        end_date: '2023-02-01',
      };

      adminService.applyDiscount = jest.fn().mockResolvedValue(null);

      await adminController.applyDiscount(req as Request, res as Response);

      expect(adminService.applyDiscount).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to create discount',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // updateDiscount
  describe('updateDiscount', () => {
    it('should update a discount and send a 201 response', async () => {
      const discountId = 1;
      req.params = { id: discountId.toString() };
      req.body = {
        event_id: 1,
        discount_percentage: 15,
        start_date: '2023-01-01',
        end_date: '2023-03-01',
      };

      adminService.updateDiscount = jest.fn().mockResolvedValue(true);

      await adminController.updateDiscount(req as Request, res as Response);

      expect(adminService.updateDiscount).toHaveBeenCalledWith(req.body, discountId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Discount updated successfully',
        status: res.statusCode,
      });
    });

    it('should send a 400 response if updateDiscount fails', async () => {
      const discountId = 1;
      req.params = { id: discountId.toString() };
      req.body = {
        event_id: 1,
        discount_percentage: 15,
        start_date: '2023-01-01',
        end_date: '2023-03-01',
      };

      adminService.updateDiscount = jest.fn().mockResolvedValue(null);

      await adminController.updateDiscount(req as Request, res as Response);

      expect(adminService.updateDiscount).toHaveBeenCalledWith(req.body, discountId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to updated discount',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // deleteDiscount
  describe('deleteDiscount', () => {
    it('should delete a discount and send a 200 response', async () => {
      const discountId = 1;
      req.params = { id: discountId.toString() };

      adminService.deleteDiscount = jest.fn().mockResolvedValue(true);

      await adminController.deleteDiscount(req as Request, res as Response);

      expect(adminService.deleteDiscount).toHaveBeenCalledWith(discountId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Discount deleted successfully',
        status: res.statusCode,
      });
    });

    it('should send a 400 response if deleteDiscount fails', async () => {
      const discountId = 1;
      req.params = { id: discountId.toString() };

      adminService.deleteDiscount = jest.fn().mockResolvedValue(null);

      await adminController.deleteDiscount(req as Request, res as Response);

      expect(adminService.deleteDiscount).toHaveBeenCalledWith(discountId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to deleted discount',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // getAllUsers
  describe('getAllUsers', () => {
    it('should retrieve all users and send a 200 response', async () => {
      const users = [{ user_id: 1, email: 'user1@example.com' }];
      adminService.getAllUsers = jest.fn().mockResolvedValue(users);

      await adminController.getAllUsers(req as Request, res as Response);

      expect(adminService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'users retrieved',
        status: res.statusCode,
        data: users,
      });
    });

    it('should send a 404 response if users are not found', async () => {
      adminService.getAllUsers = jest.fn().mockResolvedValue(null);

      await adminController.getAllUsers(req as Request, res as Response);

      expect(adminService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to retrieve users',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // getAllRegistration
  describe('getAllRegistration', () => {
    it('should retrieve all registrations and send a 200 response', async () => {
      const registrations = [{ registration_id: 1, event_id: 1, user_id: 1 }];
      adminService.getAllRegistration = jest.fn().mockResolvedValue(registrations);

      await adminController.getAllRegistration(req as Request, res as Response);

      expect(adminService.getAllRegistration).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Registrations retrieved',
        status: res.statusCode,
        data: registrations,
      });
    });

    it('should send a 404 response if registrations are not found', async () => {
      adminService.getAllRegistration = jest.fn().mockResolvedValue(null);

      await adminController.getAllRegistration(req as Request, res as Response);

      expect(adminService.getAllRegistration).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to retrieve registrations',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // getAllPayments
  describe('getAllPayments', () => {
    it('should retrieve all payments and send a 200 response', async () => {
      const payments = [{ payment_id: 1, amount: 100 }];
      adminService.getAllPayments = jest.fn().mockResolvedValue(payments);

      await adminController.getAllPayments(req as Request, res as Response);

      expect(adminService.getAllPayments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Payments retrieved',
        status: res.statusCode,
        data: payments,
      });
    });

    it('should send a 404 response if payments are not found', async () => {
      adminService.getAllPayments = jest.fn().mockResolvedValue(null);

      await adminController.getAllPayments(req as Request, res as Response);

      expect(adminService.getAllPayments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to retrieve payments',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });

  // getAllRegisByEventId
  describe('getAllRegisByEventId', () => {
    it('should retrieve all registrations for an event and send a 200 response', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };
      const registrations = [{ registration_id: 1, event_id: eventId, user_id: 1 }];
      adminService.getEventAttendee = jest.fn().mockResolvedValue(registrations);

      await adminController.getAllRegisByEventId(req as Request, res as Response);

      expect(adminService.getEventAttendee).toHaveBeenCalledWith(eventId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: `All attendees for event id: ${eventId} retrieved`,
        status: res.statusCode,
        data: registrations,
      });
    });

    it('should send a 404 response if no registrations are found', async () => {
      const eventId = 1;
      req.params = { id: eventId.toString() };
      adminService.getEventAttendee = jest.fn().mockResolvedValue(null);

      await adminController.getAllRegisByEventId(req as Request, res as Response);

      expect(adminService.getEventAttendee).toHaveBeenCalledWith(eventId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to retrieve attendees',
        status: res.statusCode,
        detail: res.statusMessage,
      });
    });
  });
});