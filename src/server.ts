import { App } from './app';
import { CorsConfig } from './middlewares/cors.middlewares';
import { env } from './validations/z.schemas/env.z.schemas';

const PORT = env.PORT;

const app = new App(CorsConfig);

app.listen(PORT);
