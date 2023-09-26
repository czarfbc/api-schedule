import express, { Application, NextFunction, Request, Response } from "express";
import { UserRoutes } from "./routes/users.routes";
import { SchedulesRoutes } from "./routes/schedules.routes";
import cors from "cors";

const app: Application = express();

const corsOptions = {
  origin: "http://localhost:3003",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRoutes = new UserRoutes().getRoutes();
const schedulesRoutes = new SchedulesRoutes().getRoutes();

app.use("/users", usersRoutes);
app.use("/schedules", schedulesRoutes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      message: "Erro Interno do Servidor",
    });
  }
);

app.listen(process.env.PORT || 3000, () => console.log("Servidor Rodando"));
