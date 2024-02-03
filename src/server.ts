import { App } from './app';
import { CorsMiddlewares } from './middlewares/cors.middlewares';
import { env } from './validations/z.schemas/env.z.schemas';

const PORT = env.PORT;

const app = new App(CorsMiddlewares.getCorsConfig());

app.listen(PORT);
