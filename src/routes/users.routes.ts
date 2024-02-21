import { Router } from 'express';
import { UsersController } from '../controllers/users.cotroller';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
class UserRoutes {
  private router: Router;
  private usersController: UsersController;
  private authMiddlewares: AuthMiddlewares;

  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.authMiddlewares = new AuthMiddlewares();
  }

  postRoutes() {
    this.router.post(
      '/create',
      this.usersController.create.bind(this.usersController)
    );

    this.router.post(
      '/auth',
      this.usersController.auth.bind(this.usersController)
    );

    this.router.post(
      '/refresh',
      this.usersController.refresh.bind(this.usersController)
    );

    return this.router;
  }

  patchRoutes() {
    this.router.patch(
      '/update',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.usersController.update.bind(this.usersController)
    );

    this.router.patch(
      '/forgot-password',
      this.usersController.forgotPassword.bind(this.usersController)
    );

    this.router.patch(
      '/update-password',
      this.usersController.recoveryPassword.bind(this.usersController)
    );

    return this.router;
  }
}
export { UserRoutes };
