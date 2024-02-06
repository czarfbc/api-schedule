import { compare, hash } from 'bcrypt';
import {
  IAuthUsers,
  ICreateUsers,
  IRecoveryPassword,
  IUpdateUsers,
  IForgotPassword,
} from '../validations/interfaces/services/users.interfaces';
import { UsersDALs } from '../database/data.access.layer/users.dals';
import { sign, verify } from 'jsonwebtoken';
import { EmailUtils } from '../utils/email.utils';
import { env } from '../validations/z.schemas/env.z.schemas';
import {
  createSchemaUsers,
  recoveryPasswordSchemaUsers,
  updateResetTokenSchemaUsers,
  updateSchemaUsers,
  authSchemaUsers,
} from '../validations/z.schemas/users.z.schemas';
import { ErrorsHelpers } from '../helpers/errors.helpers';
import { RequestRateLimitUtils } from '../utils/request.rate.limit';

class UsersServices {
  private usersDALs: UsersDALs;
  private email: EmailUtils;
  private requestRateLimit: RequestRateLimitUtils;
  private invalidAttempts: Map<string, number>;

  constructor() {
    this.usersDALs = new UsersDALs();
    this.email = new EmailUtils();
    this.requestRateLimit = new RequestRateLimitUtils();
    this.invalidAttempts = new Map();
  }

  async create({ name, email, password }: ICreateUsers) {
    const findUser = await this.usersDALs.findUserByEmail(email);
    if (findUser) {
      throw new ErrorsHelpers({
        message: 'User already exists',
        statusCode: 400,
      });
    }

    const validateInput = createSchemaUsers.parse({ name, email, password });
    const hashPassword = await hash(validateInput.password, 10);
    const create = await this.usersDALs.create({
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

  async auth({ email, password }: IAuthUsers) {
    const validateInput = authSchemaUsers.parse({ email, password });
    const findUser = await this.usersDALs.findUserByEmail(validateInput.email);
    if (!findUser) {
      throw new ErrorsHelpers({
        message: 'Invalid email or password',
        statusCode: 400,
      });
    }

    const passwordMatch = await compare(
      validateInput.password,
      findUser.password
    );
    if (!passwordMatch) {
      throw new ErrorsHelpers({
        message: 'Invalid email or password',
        statusCode: 400,
      });
    }

    let secretKeyRefreshToken: string = env.ACCESS_KEY_TOKEN_REFRESH;
    let secretKey: string = env.ACCESS_KEY_TOKEN;
    if (!secretKey || !secretKeyRefreshToken) {
      throw new ErrorsHelpers({
        message: 'There is no token key or refresh token key',
        statusCode: 506,
      });
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
      token: { token, expiresIn: '60s' },
      refreshToken: { refreshToken, expiresIn: '7d' },
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ErrorsHelpers({
        message: 'Refresh token missing',
        statusCode: 400,
      });
    }

    let secretKeyRefreshToken: string = env.ACCESS_KEY_TOKEN_REFRESH;
    let secretKey: string = env.ACCESS_KEY_TOKEN;
    if (!secretKey || !secretKeyRefreshToken) {
      throw new ErrorsHelpers({
        message: 'There is no token key or refresh token key',
        statusCode: 506,
      });
    }

    const verifyRefreshToken = verify(refreshToken, secretKeyRefreshToken);

    const { sub } = verifyRefreshToken;

    const newToken = sign({ sub }, secretKey, {
      expiresIn: '1h',
    });
    const newRefreshToken = sign({ sub }, secretKeyRefreshToken, {
      expiresIn: '7d',
    });
    return {
      token: { token: newToken, expiresIn: '1h' },
      refreshToken: { refreshToken: newRefreshToken, expiresIn: '7d' },
    };
  }

  async update({ oldPassword, newPassword, user_id, name }: IUpdateUsers) {
    if (oldPassword && newPassword) {
      const findUserById = await this.usersDALs.findUserById(user_id);
      if (!findUserById) {
        throw new ErrorsHelpers({ message: 'User not found', statusCode: 404 });
      }

      const passwordMatch = await compare(oldPassword, findUserById.password);
      if (!passwordMatch) {
        throw new ErrorsHelpers({
          message: 'Old password invalid',
          statusCode: 400,
        });
      }

      const validateInput = updateSchemaUsers.parse({
        name,
        oldPassword,
        newPassword,
        user_id,
      });
      const password = await hash(validateInput.newPassword, 10);
      const result = await this.usersDALs.update({
        newPassword: password,
        user_id: validateInput.user_id,
        name: validateInput.name,
      });

      return {
        result,
        message: 'User updated successfully',
      };
    } else {
      throw new ErrorsHelpers({
        message: 'Fill in the fields correctly',
        statusCode: 400,
      });
    }
  }

  async forgotPassword({ email, ip }: IForgotPassword) {
    if (ip === undefined) {
      throw new ErrorsHelpers({ message: 'Cannot find ip', statusCode: 404 });
    }
    if (this.requestRateLimit.checkIfTheIpIsBlocked(ip)) {
      throw new ErrorsHelpers({
        message: 'Too many requests. This IP has been blocked for 15 minutes',
        statusCode: 429,
      });
    }

    const findUser = await this.usersDALs.findUserByEmail(email);

    if (!findUser) {
      const attempts = this.invalidAttempts.get(ip) || 0;
      this.invalidAttempts.set(ip, attempts + 1);
      if (attempts + 1 === 3) this.requestRateLimit.blockedIP(ip);

      throw new ErrorsHelpers({ message: 'User not found', statusCode: 404 });
    }

    const oneHours: number = 3600000;
    const resetToken = await hash(findUser.email + Date.now(), 10);
    const resetTokenExpiry = new Date(Date.now() + oneHours);

    const validateInput = updateResetTokenSchemaUsers.parse({
      resetToken,
      resetTokenExpiry,
      email: findUser.email,
    });

    const token = await this.usersDALs.updateResetToken({
      resetToken: validateInput.resetToken,
      resetTokenExpiry: validateInput.resetTokenExpiry,
      email: validateInput.email,
    });

    const emailData = await this.email.sendEmail({
      inviteTo: email,
      subject: 'Recuperação de Senha!!!',
      html: `"<p>codigo para recuperar senha <h1>${token.resetToken}</h1></p>`,
    });

    return emailData;
  }

  async recoveryPassword({ resetToken, newPassword }: IRecoveryPassword) {
    const findUser = await this.usersDALs.findUserByToken(resetToken);

    if (!findUser)
      throw new ErrorsHelpers({
        message: 'User by token not found',
        statusCode: 404,
      });

    const now = new Date();

    if (findUser.resetTokenExpiry && now > findUser.resetTokenExpiry) {
      throw new ErrorsHelpers({ message: 'Token expired', statusCode: 401 });
    }

    const validateInput = recoveryPasswordSchemaUsers.parse({
      newPassword,
    });

    const hashedPassword = await hash(validateInput.newPassword, 10);

    const result = await this.usersDALs.updatePassword({
      newPassword: hashedPassword,
      email: findUser.email,
    });
    return result;
  }
}
export { UsersServices };
