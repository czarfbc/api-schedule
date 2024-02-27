import { prisma } from '../prisma';
import * as userInterfaces from '../../validations/interfaces/services/user.interfaces';

class UserDAL {
  async create({ name, email, password }: userInterfaces.ICreateUser) {
    const result = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    return result;
  }

  async findUserByEmail(email: string) {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return result;
  }

  async findUserById(id: string) {
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async update({ newPassword, user_id, name }: userInterfaces.IUpdateUser) {
    const result = await prisma.user.update({
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

  async updateResetToken({
    resetToken,
    resetTokenExpiry,
    email,
  }: userInterfaces.IUserUpdateResetToken) {
    const result = await prisma.user.update({
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
    const result = await prisma.user.findFirstOrThrow({
      where: {
        resetToken,
      },
    });

    return result;
  }
  async updatePassword({ newPassword, email }: userInterfaces.IUpdatePassword) {
    const result = await prisma.user.update({
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
export { UserDAL };
