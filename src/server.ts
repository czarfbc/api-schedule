import { App } from './app';
import { env } from './z.schema/env.z.schema';

const corsConfig = {
  origin: 'http://localhost:3003',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

const PORT = env.PORT;

const app = new App(corsConfig);

app.listen(PORT);
