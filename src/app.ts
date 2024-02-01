import 'express-async-errors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { UserRoutes } from './routes/users.routes';
import { SchedulesRoutes } from './routes/schedules.routes';
import { ErrorsMiddleware } from './middlewares/errors.middleware';
import { TCorsMiddleware } from './validations/types/cors.types';

export class App {
  private app: Application;

  constructor(CorsConfig: TCorsMiddleware) {
    this.app = express();
    this.middleware(CorsConfig);
    this.setupUsersRoutes();
    this.setupSchedulesRoutes();
  }

  private middleware(CorsConfig: TCorsMiddleware) {
    this.app.use(express.json());
    this.app.use(CorsConfig);
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupUsersRoutes() {
    const userRouters = new UserRoutes();
    const userBaseRoute = '/users';
    this.app.use(userBaseRoute, userRouters.postRoutes());
    this.app.use(userBaseRoute, userRouters.patchRoutes());
  }

  private setupSchedulesRoutes() {
    const schedulesRoutes = new SchedulesRoutes();
    const scheduleBaseRoute = '/schedules';
    this.app.use(scheduleBaseRoute, schedulesRoutes.postRoutes());
    this.app.use(scheduleBaseRoute, schedulesRoutes.getRoutes());
    this.app.use(scheduleBaseRoute, schedulesRoutes.patchRoutes());
    this.app.use(scheduleBaseRoute, schedulesRoutes.deleteRoutes());
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
    this.app.use(ErrorsMiddleware);
  }
}
