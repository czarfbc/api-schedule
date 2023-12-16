import { Router } from 'express';
import { UsersController } from '../controllers/users.cotroller';
import { AuthMiddleware } from '../middlewares/auth';
class UserRoutes {
  private router: Router;
  private usersController: UsersController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.authMiddleware = new AuthMiddleware();
  }

  postRoutes() {
    this.router.post(
      '/create',
      this.usersController.store.bind(this.usersController)
    );

    this.router.put(
      '/update',

      this.authMiddleware.auth.bind(this.authMiddleware),
      this.usersController.update.bind(this.usersController)
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
}
export { UserRoutes };
