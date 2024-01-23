import express, { Application } from 'express';
import { UserRoutes } from './routes/users.routes';
import { SchedulesRoutes } from './routes/schedules.routes';
import cors, { CorsOptions } from 'cors';

export class App {
  private app: Application;

  constructor(corsConfig?: CorsOptions) {
    this.app = express();
    this.middleware(corsConfig);
    this.setupUsersRoutes();
    this.setupSchedulesRoutes();
  }

  private middleware(corsConfig?: CorsOptions) {
    this.app.use(express.json());
    this.app.use(cors(corsConfig));
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
  }
}
