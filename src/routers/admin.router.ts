import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const adminController = new AdminController();
const authenticateJwt = new AuthenticateJwtMiddleware();

//CRUD events
router.get(
  "/events",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.getAllEvents.bind(adminController)
);
router.get("/events/:id", adminController.getEventById.bind(adminController));

router.post(
  "/events",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  upload.single("image"),
  adminController.createEvent.bind(adminController)
);

router.put(
  "/events/:id", 
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.updateEvent.bind(adminController));

router.delete(
  "/events/:id", 
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.deleteEvent.bind(adminController));

//CRUD discounts
router.get("/discounts", adminController.getAllDiscounts.bind(adminController));

router.post(
  "/discounts", 
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.applyDiscount.bind(adminController));

router.put(
  "/discounts/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.updateDiscount.bind(adminController)
);

router.delete(
  "/discounts/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.deleteDiscount.bind(adminController)
);

//stats
router.get(
  "/stats/users",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.getAllUsers.bind(adminController)
);
router.get(
  "/stats/registrations",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.getAllRegistration.bind(adminController)
);
router.get(
  "/stats/payments",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.getAllPayments.bind(adminController)
);
router.get(
  "/stats/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("ADMIN").bind(authenticateJwt),
  adminController.getAllRegisByEventId.bind(adminController)
);

export default router;
