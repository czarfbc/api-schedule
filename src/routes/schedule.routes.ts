import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.controller';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';

class SchedulesRoutes {
  private router: Router;
  private scheduleController: ScheduleController;
  private authMiddlewares: AuthMiddlewares;

  constructor() {
    this.router = Router();
    this.scheduleController = new ScheduleController();
    this.authMiddlewares = new AuthMiddlewares();
  }

  postRoutes() {
    this.router.post(
      '/create',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.scheduleController.create.bind(this.scheduleController)
    );

    return this.router;
  }

  getRoutes() {
    this.router.get(
      '/get-of-day',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.scheduleController.findEverythingOfTheDay.bind(
        this.scheduleController
      )
    );

    this.router.get(
      '/get-all',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.scheduleController.findEverythingOfTheDay.bind(
        this.scheduleController
      )
    );

    return this.router;
  }

  patchRoutes() {
    this.router.patch(
      '/patch/:id',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.scheduleController.update.bind(this.scheduleController)
    );

    return this.router;
  }

  deleteRoutes() {
    this.router.delete(
      '/delete-old-schedules',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.scheduleController.deleteOldSchedules.bind(this.scheduleController)
    );

    this.router.delete(
      '/delete/:id',
      this.authMiddlewares.handleAuth.bind(this.authMiddlewares),
      this.scheduleController.delete.bind(this.scheduleController)
    );

    return this.router;
  }
}
export { SchedulesRoutes };
