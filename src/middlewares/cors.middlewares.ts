import { CorsOptions } from 'cors';

class CorsMiddlewares {
  private corsConfig: CorsOptions = {
    origin: 'http://localhost:3003',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD',
    optionsSuccessStatus: 204,
    credentials: true,
    maxAge: 600,
  };

  handleCors(): CorsOptions {
    return this.corsConfig;
  }
}

export { CorsMiddlewares };
