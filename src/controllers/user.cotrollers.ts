import { Request, Response } from 'express';
import { UserService } from '../services/user.services';

class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const result = await this.userService.create({ name, email, password });

    return response.status(201).json({ result });
  }

  async auth(request: Request, response: Response) {
    const { email, password } = request.body;

    const result = await this.userService.auth({ email, password });

    return response.json(result);
  }

  async refresh(request: Request, response: Response) {
    const { refreshToken } = request.body;

    const result = await this.userService.refresh(refreshToken);

    return response.json(result);
  }

  async update(request: Request, response: Response) {
    const { name, oldPassword, newPassword } = request.body;
    const { user_id } = request;

    const result = await this.userService.update({
      name,
      oldPassword,
      newPassword,
      user_id,
    });

    return response.status(200).json(result);
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;
    const ip = request.clientIp;

    const result = await this.userService.forgotPassword({ email, ip });

    return response.status(200).json(result);
  }

  async recoveryPassword(request: Request, response: Response) {
    const { resetToken } = request.query as { resetToken: string };
    const { newPassword } = request.body;

    const result = await this.userService.recoveryPassword({
      resetToken,
      newPassword,
    });

    return response.status(200).json(result);
  }
}

export { UserController };
