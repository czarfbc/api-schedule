import { prisma } from '../prisma';
import * as usersInterfaces from '../../validations/interfaces/services/users.interfaces';
import * as usersZScemas from '../../validations/z.schemas/users.z.schemas';

class UsersDALs {
  async create({ name, email, password }: usersInterfaces.ICreateUsers) {
    const validateInput = usersZScemas.createSchemaUsers.parse({
      name,
      email,
      password,
    });

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

  async update({ newPassword, user_id, name }: usersInterfaces.IUpdateUsers) {
    const validateInput = usersZScemas.updateSchemaUsers.parse({
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
  }: usersInterfaces.IUsersUpdateResetToken) {
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
  async updatePassword({
    newPassword,
    email,
  }: usersInterfaces.IUpdatePassword) {
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
export { UsersDALs };
