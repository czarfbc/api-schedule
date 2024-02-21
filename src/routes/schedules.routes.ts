import { Router } from 'express';
import { SchedulesController } from '../controllers/schedules.controller';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';

class SchedulesRoutes {
  private router: Router;
  private schedulesController: SchedulesController;
  private authMiddlewares: AuthMiddlewares;

  constructor() {
    this.router = Router();
    this.schedulesController = new SchedulesController();
    this.authMiddlewares = new AuthMiddlewares();
  }

  postRoutes() {
    this.router.post(
      '/create',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.schedulesController.create.bind(this.schedulesController)
    );

    return this.router;
  }

  getRoutes() {
    this.router.get(
      '/get-of-day',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.schedulesController.findEverythingOfTheDay.bind(
        this.schedulesController
      )
    );

    this.router.get(
      '/get-all',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.schedulesController.findEverythingOfTheDay.bind(
        this.schedulesController
      )
    );

    return this.router;
  }

  patchRoutes() {
    this.router.patch(
      '/patch/:id',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.schedulesController.update.bind(this.schedulesController)
    );

    return this.router;
  }

  deleteRoutes() {
    this.router.delete(
      '/delete-old-schedules',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.schedulesController.deleteOldSchedules.bind(this.schedulesController)
    );

    this.router.delete(
      '/delete/:id',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.schedulesController.delete.bind(this.schedulesController)
    );

    return this.router;
  }
}
export { SchedulesRoutes };
