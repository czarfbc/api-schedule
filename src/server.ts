import { App } from './app';
import { env } from './validations/z.schemas/env.z.schemas';

const PORT = env.PORT;

const app = new App();

app.listen(PORT);
