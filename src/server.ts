import express, { Application, NextFunction, Request, Response } from 'express';
import { UserRoutes } from './routes/users.routes';

const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const usersRoutes = new UserRoutes().getRoutes()

app.use('/users', usersRoutes)

app.use((err:Error, request:Request, response:Response, next:NextFunction) => {
    if(err instanceof Error) {
        return response.status(400).json({
            messagr: err.message,
        })
    }
    return response.status(500).json({
        message: 'Internal Server Error',
    })
})

app.listen(3000, ()=> console.log('rodando'))