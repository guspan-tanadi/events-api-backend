import { Request, Response, NextFunction, RequestHandler } from "express";
import environment from "dotenv";
import jwt from "jsonwebtoken";

environment.config();

export class AuthenticateJwtMiddleware {
  authenticateJwt(req: Request, res: Response, next: NextFunction): any {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).send({
          message: "Authorization header is missing",
          status: res.statusCode,
        });
      }

      const token = authorizationHeader.split(" ")[1];
      if (!token) {
        return res.status(401).send({
          message: "Access token is missing or invalid",
          status: res.statusCode,
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return res.status(500).send({
          message: "Internal server error",
          status: res.statusCode,
        });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).send({
            message: "Invalid token",
            status: res.statusCode,
          });
        } else {
          (req as any).user = user;
          next();
        }
      });
    } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).send({
        message: "Internal server error",
        status: res.statusCode,
      });
    }
  }

  authorizeRole(roles: string | string[]) {
    return (req: Request, res: Response, next: NextFunction): any => {
      try {
        const user = (req as any).user;
        if (!user) {
          return res.status(401).send({
            message: "User not authenticated",
            status: res.statusCode,
          });
        }

        const userRole = user.role;
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        if (!rolesArray.includes(userRole)) {
          return res.status(403).send({
            message: "Forbidden",
            status: res.statusCode,
          });
        }
        next();
      } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).send({
          message: "Internal server error",
          status: res.statusCode,
        });
      }
    };
  }

  authorizeUserId() {
    return (req: Request, res: Response, next: NextFunction): any => {
      try {
        const user = (req as any).user;
        const paramUserId = parseInt(req.params.id);

        if (!user) {
          return res.status(401).send({
            message: "User not authenticated",
            status: res.statusCode,
          });
        }

        // Check if user_id in JWT matches user_id in request params
        if (user.id !== paramUserId) {
          return res.status(403).send({
            message: "Forbidden: You can only access your own data",
            status: res.statusCode,
          });
        }

        next();
      } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).send({
          message: "Internal server error",
          status: res.statusCode,
        });
      }
    };
  }
}