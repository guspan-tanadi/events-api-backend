import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Auth } from "../models/models";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await this.authService.login(
        email,
        password
      );
      const data = { user, accessToken, refreshToken };

      res.status(200).send({
        message: "Successful login",
        status: res.statusCode,
        data: {
          user: data.user,
          access_token: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error: any) {
      res.status(400).send({
        message: "Failed to login, user not found",
        status: res.statusCode,
        detail: error.errors
      });
    }
  }

  async register(req: Request, res: Response) {
    console.log(req.body);
    try {
      const user: Auth = req.body;
      const data = await this.authService.register(user);
      console.log("Data: ", data);
      res.status(201).send({
        message: "Successfully register",
        status: res.statusCode,
      });
    } catch (error: any) {
      res.status(400).send({
        message: `failed to register: ${error.errors}`,
        status: res.statusCode,
      });
    }
    // const user: Auth = req.body;
    // const data = await this.authService.register(user)
    // if (data){
    //     res.status(200).send({
    //         message: "Successfully register",
    //         status: res.statusCode,
    //         data: data,
    //     })
    // } else {
    //     res.status(400).send({
    //         message: "Failed to register, please try again later",
    //         status: res.statusCode,
    //     })
    // }
  }

  async refershToken(req: Request, res: Response) {
    const { refereshToken } = req.body;
    const data = await this.authService.refereshToken(refereshToken);
    if (data) {
      res.status(200).send({
        data: {
          refereshToken: data,
        },
        message: "Token Updated",
        status: res.statusCode,
      });
    }
  }
}
