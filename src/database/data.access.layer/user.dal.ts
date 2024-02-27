import { prisma } from '../prisma';
import * as userInterfaces from '../../validations/interfaces/services/user.interfaces';
import * as userZScemas from '../../validations/z.schemas/user.z.schemas';

class UserDAL {
  async create({ name, email, password }: userInterfaces.ICreateUser) {
    const validateInput = userZScemas.createSchemaUser.parse({
      name,
      email,
      password,
    });

    const result = await prisma.user.create({
      data: {
        name: validateInput.name,
        email: validateInput.email,
        password: validateInput.password,
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
    const validateInput = userZScemas.updateSchemaUser.parse({
      newPassword,
      user_id,
      name,
    });

    const result = await prisma.user.update({
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
