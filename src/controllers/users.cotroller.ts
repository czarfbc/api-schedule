import { NextFunction, Request, Response } from 'express';
import { UsersServices } from '../services/users.services';
import { ZodError } from 'zod';

class UsersController {
  private usersServices: UsersServices;
  constructor() {
    this.usersServices = new UsersServices();
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;
    try {
      const result = await this.usersServices.create({ name, email, password });

      return response.status(201).json({ result });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => err.message);
        return response.status(400).json({ errors: validationErrors });
      }
      next(error);
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    try {
      const result = await this.usersServices.auth({ email, password });
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
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => err.message);
        return response.status(400).json({ errors: validationErrors });
      }
      next(error);
    }
  }

  async forgotPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { email } = request.body;
    try {
      const result = await this.usersServices.forgotPassword(email);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
export { UsersController };
