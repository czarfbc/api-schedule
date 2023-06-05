import { compare, hash } from "bcrypt"
import { ICreate, IUpdate } from "../interfaces/users.interface"
import { UsersRepository } from "../repositories/users.repository"
import { s3 } from "../config/aws";
import { v4 as uuid } from "uuid"
import { sign } from "jsonwebtoken";

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
        const create = await this.usersRepository.create({name, email, password: hashPassword})

        return create
    }
    async update({name, oldPassword, newPassword, avatar_url, user_id}:IUpdate) {
        let password
        if(oldPassword && newPassword) {
            const findUserById = await this.usersRepository.findUserById(user_id)
            if(!findUserById) {
                throw new Error('User not found')
            }

            const  passwordMatch = compare(oldPassword, findUserById.password)
            if(!passwordMatch) {
                throw new Error('Password invalid')
            }
            password = await hash(newPassword, 10)
            
            await this.usersRepository.updatePassword(password, user_id)
        }
        if(avatar_url) {
            const uploadImage = avatar_url?.buffer
            const uploadS3 = await s3.upload({
                Bucket: 'semana--heroi',
                Key: `${uuid()}-${avatar_url?.originalname}`,
                //ACL: 'public-read',
                Body: uploadImage,
            }).promise()
            console.log('url imagem <<=>>',uploadS3.Location)

            await this.usersRepository.update(name, uploadS3.Location ,user_id)
        }   
        return {
            message: 'User updated successfully'
        }
    }

    async auth(email: string, password: string) {
        const findUser = await this.usersRepository.findUserByEmail(email)
        if(!findUser) {
            throw new Error('User or password invalid')
        }

        const  passwordMatch = compare(password, findUser.password)
        if(!passwordMatch) {
            throw new Error('User or password invalid')
        }

        let secretkey: string | undefined = process.env.ACCESS_KEY_TOKEN
        if(!secretkey) {
            throw new Error('There i no token key')
        }

        const token = sign({email}, secretkey, {
            subject: findUser.id,
            expiresIn: 60 * 15,
        })

        return {
            token,
            user: {
                name: findUser.name,
                email: findUser.email,
            },
        }
    }
}
export {UsersServices}