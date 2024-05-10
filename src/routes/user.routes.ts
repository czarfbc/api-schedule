import { Router } from 'express';
import { UserController } from '../controllers/user.cotrollers';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';

class UserRoutes {
  private router: Router;
  private userController: UserController;
  private authMiddlewares: AuthMiddlewares;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddlewares = new AuthMiddlewares();
  }

  postRoutes() {
    this.router.post(
      '/create',
      this.userController.create.bind(this.userController)
    );

    this.router.post(
      '/auth',
      this.userController.auth.bind(this.userController)
    );

    this.router.post(
      '/refresh',
      this.userController.refresh.bind(this.userController)
    );

    return this.router;
  }

  patchRoutes() {
    this.router.patch(
      '/update',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.userController.update.bind(this.userController)
    );

    this.router.patch(
      '/forgot-password',
      this.userController.forgotPassword.bind(this.userController)
    );

    this.router.patch(
      '/update-password',
      this.userController.recoveryPassword.bind(this.userController)
    );

    return this.router;
  }
}
export { UserRoutes };
