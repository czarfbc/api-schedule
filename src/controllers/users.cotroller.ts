import { NextFunction, Request, Response } from "express";
import { UsersServices } from "../services/users.services";

class UsersController{
    private usersServices:UsersServices
    constructor() {
        this.usersServices = new UsersServices()
    }
    index() {

    }
    show() {

    }
    async store(request:Request, response:Response, next:NextFunction) {
        const {name, email, password} = request.body
        try {
            const result = await this.usersServices.create({name, email, password})

            return response.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }
    auth() {

    }
    update(request:Request, response:Response, next:NextFunction) {
        const {name, oldPassword, newPassword} = request.body
        console.log(request.files)
        try {
        } catch (error) {
            next(error)
        }
    }
}
export {UsersController}