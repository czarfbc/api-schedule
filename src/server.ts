import { App } from './app';

const corsConfig = {
  origin: 'http://localhost:3003',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

const app = new App(corsConfig);

// app.use(
//   (err: Error, request: Request, response: Response, next: NextFunction) => {
//     if (err instanceof Error) {
//       return response.status(400).json({
//         message: err.message,
//       });
//     }
//     return response.status(500).json({
//       message: "Erro Interno do Servidor",
//     });
//   }
// );

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT);
