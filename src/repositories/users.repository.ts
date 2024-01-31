import { prisma } from '../database/prisma';
import {
  ICreateUsers,
  IUpdatePassword,
  IUpdateUsers,
  IUsersUpdateResetToken,
} from '../validations/interfaces/users.interface';
import {
  createSchemaUsers,
  updateSchemaUsers,
} from '../validations/z.schema/users.z.schema';

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
    email,
  }: IUsersUpdateResetToken) {
    const result = await prisma.users.update({
      where: {
        email,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    return result;
  }

  async findUserByToken(resetToken: string) {
    const result = await prisma.users.findFirstOrThrow({
      where: {
        resetToken,
      },
    });

    return result;
  }
  async updatePassword({ newPassword, email }: IUpdatePassword) {
    const result = await prisma.users.update({
      where: {
        email,
      },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return result;
  }
}
export { UsersRepository };
