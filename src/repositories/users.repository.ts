import { prisma } from '../database/prisma';
import { ICreate, IUpdate } from '../interfaces/users.interface';

class UsersRepository {
  async create({ name, email, password }: ICreate) {
    const result = await prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });
    return result;
  }

  async findUserByEmail(email: string) {
    const result = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    return result;
  }

  async findUserById(id: string) {
    const result = await prisma.users.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async update({ newPassword, user_id, name }: IUpdate) {
    const result = await prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        password: newPassword,
        name,
      },
    });
    return result;
  }
}
export { UsersRepository };
