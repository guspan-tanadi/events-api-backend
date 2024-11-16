import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();
const authenticateJwt = new AuthenticateJwtMiddleware();

router.get("/events", userController.getEvents.bind(userController));
router.get(
  "/events/discount",
  userController.getAllDiscounts.bind(userController)
);
router.get(
  "/events/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.getEventById.bind(userController)
);
router.get(
  "/users/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  authenticateJwt.authorizeUserId().bind(authenticateJwt),
  userController.getUserById.bind(userController)
);
router.get(
  "/registrations/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.getRegistrationByUserId.bind(userController)
);
router.get(
  "/reviews/event/:id",
  userController.getReviewsByEventId.bind(userController)
);
router.get(
  "/reviews/user/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.getReviewsByUserId.bind(userController)
);
router.get(
  "/events/discount/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.getDiscountByEventId.bind(userController)
);

router.post(
  "/register",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.registerEvent.bind(userController)
);
router.post(
  "/payments",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.payRegistration.bind(userController)
);
router.post(
  "/reviews",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.reviewEvent.bind(userController)
);

router.patch(
  "/attend/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  userController.attendEventByRegisId.bind(userController)
);

export default router;
