import 'express-async-errors';
import express, { Application } from 'express';
import { UserRoutes } from './routes/user.routes';
import { SchedulesRoutes } from './routes/schedule.routes';
import { SwaggerRoutes } from './routes/swagger.router';
import { ErrorMiddlewares } from './middlewares/error.middleware';
import cors, { CorsOptions } from 'cors';
import requestIp from 'request-ip';

export class App {
  private app: Application;
  private errorMiddlewares: ErrorMiddlewares;

  constructor(corsConfig: CorsOptions) {
    this.app = express();
    this.errorMiddlewares = new ErrorMiddlewares();
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
    this.setupSwaggerDocs();
  }

  private setupSwaggerDocs() {
    const swaggerRoutes = new SwaggerRoutes();
    const swaggerBaseRoute = '/api-docs';

    this.app.use(swaggerBaseRoute, swaggerRoutes.useRoutes());
  }

  private setupUsersRoutes() {
    const userRouters = new UserRoutes();
    const userBaseRoute = '/user';

    this.app.use(userBaseRoute, userRouters.postRoutes());
    this.app.use(userBaseRoute, userRouters.patchRoutes());
  }

  private setupSchedulesRoutes() {
    const schedulesRoutes = new SchedulesRoutes();
    const scheduleBaseRoute = '/schedule';

    this.app.use(scheduleBaseRoute, schedulesRoutes.postRoutes());
    this.app.use(scheduleBaseRoute, schedulesRoutes.getRoutes());
    this.app.use(scheduleBaseRoute, schedulesRoutes.patchRoutes());
    this.app.use(scheduleBaseRoute, schedulesRoutes.deleteRoutes());
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(
        `\x1b[38;2;0;255;0mServer running on:\x1b[0m \x1b[38;2;0;255;255mhttp://localhost:${port}\x1b[0m `
      );
    });
    this.app.use(this.errorMiddlewares.handleError.bind(this.errorMiddlewares));
  }
}
