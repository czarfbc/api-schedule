import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerUserDocs from '../docs/user.docs.json';
import swaggerScheduleDocs from '../docs/schedule.docs.json';

class SwaggerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  useRoutes() {
    this.router.use('/user', swaggerUi.serve, swaggerUi.setup(swaggerUserDocs));

    this.router.use(
      '/schedule',
      swaggerUi.serve,
      swaggerUi.setup(swaggerScheduleDocs)
    );

    return this.router;
  }
}
export { SwaggerRoutes };
