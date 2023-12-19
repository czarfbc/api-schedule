import { NextFunction, Request, Response } from 'express';
import { UsersServices } from '../services/users.services';
import { Resend } from 'resend';

class UsersController {
  private usersServices: UsersServices;
  constructor() {
    this.usersServices = new UsersServices();
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;
    try {
      const resend = new Resend('re_Y7MRdSEb_9NS2cecFqRNsLhZeEpsGphQi');

      const result = await this.usersServices.create({ name, email, password });
      const data = await resend.emails.send({
        from: 'ScheduleSystem <onboarding@resend.dev>',
        to: email,
        subject: 'Bem vindo!!!',
        html: `<h1>Olá ${name}, seja bem vindo ao nosso sistema</h1>`,
      });

      return response.status(201).json({ result, data });
    } catch (error) {
      next(error);
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    try {
      const result = await this.usersServices.auth(email, password);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(request: Request, response: Response, next: NextFunction) {
    const { refresh_token } = request.body;
    try {
      const result = await this.usersServices.refresh(refresh_token);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, oldPassword, newPassword } = request.body;
    const { user_id } = request;

    try {
      const result = await this.usersServices.update({
        name,
        oldPassword,
        newPassword,
        user_id,
      });
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
export { UsersController };
