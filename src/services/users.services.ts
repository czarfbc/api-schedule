import { hash } from "bcrypt"
import { ICreate } from "../interfaces/users.interface"
import { UsersRepository } from "../repositories/users.repository"

class UsersServices{
    private usersRepository:UsersRepository
    constructor() {
        this.usersRepository = new UsersRepository()
    }
    async create({name, email, password}:ICreate) {
        const findUser = await this.usersRepository.findUserByEmail(email)
        if(findUser) {
            throw new Error('User exists')
        }

        const hashPassword = await hash(password, 10)
        const create = this.usersRepository.create({name, email, password: hashPassword})

        return create
    }
}
export {UsersServices}