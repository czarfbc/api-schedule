import { prisma } from '../database/prisma';
import {
  ICreateUsers,
  IUpdateUsers,
  IUsersUpdateResetToken,
} from '../interfaces/users.interface';
import {
  createSchemaUsers,
  updateSchemaUsers,
} from '../z.schema/users.z.schema';

class UsersRepository {
  async create({ name, email, password }: ICreateUsers) {
    const validateInput = createSchemaUsers.parse({ name, email, password });

    const result = await prisma.users.create({
      data: {
        name: validateInput.name,
        email: validateInput.email,
        password: validateInput.password,
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

  async update({ newPassword, user_id, name }: IUpdateUsers) {
    const validateInput = updateSchemaUsers.parse({
      newPassword,
      user_id,
      name,
    });

    const result = await prisma.users.update({
      where: {
        id: validateInput.user_id,
      },
      data: {
        password: validateInput.newPassword,
        name: validateInput.name,
      },
    });
    return result;
  }

  async updateResetToken({
    resetToken,
    resetTokenExpiry,
    user,
  }: IUsersUpdateResetToken) {
    const result = await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    return result;
  }
}
export { UsersRepository };
