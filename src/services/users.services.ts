import { compare, hash } from 'bcrypt';
import {
  IAuthUsers,
  ICreateUsers,
  IUpdateUsers,
} from '../interfaces/users.interface';
import { UsersRepository } from '../repositories/users.repository';
import { sign, verify } from 'jsonwebtoken';
import { EmailUtils } from '../utils/email.utils';
import { env } from '../z.schema/env.z.schema';
import {
  createSchemaUsers,
  updateSchemaUsers,
} from '../z.schema/users.z.schema';

class UsersServices {
  private usersRepository: UsersRepository;
  private email: EmailUtils;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.email = new EmailUtils();
  }

  async create({ name, email, password }: ICreateUsers) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    if (findUser) {
      throw new Error('User already exists');
    }

    const validateInput = createSchemaUsers.parse({ name, email, password });
    const hashPassword = await hash(validateInput.password, 10);
    const create = await this.usersRepository.create({
      name: validateInput.name,
      email: validateInput.email,
      password: hashPassword,
    });

    const emailData = await this.email.sendEmail({
      inviteTo: email,
      subject: 'Bem Vindo!!!',
      html: `"<h1>Olá ${name}, seja bem vindo(a) ao seu novo sistema de agendamento</h1>`,
    });

    return { create, emailData };
  }

  async update({ oldPassword, newPassword, user_id, name }: IUpdateUsers) {
    if (oldPassword && newPassword) {
      const findUserById = await this.usersRepository.findUserById(user_id);
      if (!findUserById) {
        throw new Error('User not found');
      }

      const passwordMatch = await compare(oldPassword, findUserById.password);
      if (!passwordMatch) {
        throw new Error('nvalid password');
      }

      const validateInput = updateSchemaUsers.parse({
        name,
        oldPassword,
        newPassword,
        user_id,
      });
      const password = await hash(validateInput.newPassword, 10);
      const result = await this.usersRepository.update({
        newPassword: password,
        user_id: validateInput.user_id,
        name: validateInput.name,
      });

      return {
        result,
        message: 'User updated successfully',
      };
    } else {
      throw new Error('Fill in the fields correctly');
    }
  }

  async auth({ email, password }: IAuthUsers) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await compare(password, findUser.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    let secretKey: string = env.ACCESS_KEY_TOKEN;
    if (!secretKey) {
      throw new Error('There is no token key');
    }
    let secretKeyRefreshToken: string = env.ACCESS_KEY_TOKEN_REFRESH;
    if (!secretKeyRefreshToken) {
      throw new Error('There is no token key');
    }

    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: '60s',
    });
    const refreshToken = sign({ email }, secretKeyRefreshToken, {
      subject: findUser.id,
      expiresIn: '7d',
    });

    return {
      token,
      refresh_token: refreshToken,
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    };
  }

  async refresh(refresh_token: string) {
    if (!refresh_token) {
      throw new Error('Refresh token missing');
    }
    let secretKeyRefreshToken: string = env.ACCESS_KEY_TOKEN_REFRESH;
    if (!secretKeyRefreshToken) {
      throw new Error('There is no refresh token key');
    }

    let secretKey: string = env.ACCESS_KEY_TOKEN;
    if (!secretKey) {
      throw new Error('There is no token key');
    }

    const verifyRefreshToken = verify(refresh_token, secretKeyRefreshToken);

    const { sub } = verifyRefreshToken;

    const newToken = sign({ sub }, secretKey, {
      expiresIn: '1h',
    });
    const refreshToken = sign({ sub }, secretKeyRefreshToken, {
      expiresIn: '7d',
    });
    return { token: newToken, refresh_token: refreshToken };
  }

  async forgotPassword(email: string) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (!findUser) {
      throw new Error('User not found');
    }

    const oneHours: number = 3600000;
    const resetToken = await hash(findUser.email + Date.now(), 10);
    const resetTokenExpiry = new Date(Date.now() + oneHours);
    const token = await this.usersRepository.updateResetToken({
      resetToken,
      resetTokenExpiry,
      user: findUser,
    });

    const emailData = await this.email.sendEmail({
      inviteTo: email,
      subject: 'Recuperação de Senha!!!',
      html: `"<p>codigo para recuperar senha <h1>${token.resetToken}</h1></p>`,
    });

    if (!emailData) {
      throw new Error('Error sending email');
    }

    return emailData;
  }
}
export { UsersServices };
