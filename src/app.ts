import 'express-async-errors';
import express, { Application } from 'express';
import { UserRoutes } from './routes/users.routes';
import { SchedulesRoutes } from './routes/schedules.routes';
import { ErrorsMiddlewares } from './middlewares/errors.middleware';
import cors, { CorsOptions } from 'cors';
import requestIp from 'request-ip';

export class App {
  private app: Application;
  private errorsMiddlewares: ErrorsMiddlewares;

  constructor(corsConfig: CorsOptions) {
    this.app = express();
    this.errorsMiddlewares = new ErrorsMiddlewares();
    this.middleware(corsConfig);
    this.setupAllRoutes();
  }

  private middleware(corsConfig: CorsOptions) {
    this.app.use(express.json());
    this.app.use(cors(corsConfig));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(requestIp.mw());
  }

  private setupAllRoutes() {
    this.setupUsersRoutes();
    this.setupSchedulesRoutes();
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
    this.app.use(
      this.errorsMiddlewares.handleError.bind(this.errorsMiddlewares)
    );
  }
}
