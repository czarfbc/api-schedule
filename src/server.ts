import { App } from './app';
import { CorsMiddlewares } from './middlewares/cors.middlewares';
import { env } from './validations/z.schemas/env.schemas';

const PORT = env.PORT;

const corsMiddlewares = new CorsMiddlewares();

const app = new App(corsMiddlewares.handleCors());

app.listen(PORT);
