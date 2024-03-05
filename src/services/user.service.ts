import { compare, hash } from 'bcrypt';
import * as usersInterfaces from '../validations/interfaces/services/user.interfaces';
import { UserDAL } from '../database/data.access.layer/user.dal';
import { sign, verify } from 'jsonwebtoken';
import { EmailUtils } from '../utils/email.utils';
import { env } from '../validations/z.schemas/env.z.schemas';
import * as userZSchemas from '../validations/z.schemas/user.z.schemas';
import * as errorHelpers from '../helpers/error.helpers';
import { RequestRateLimitUtils } from '../utils/request.rate.limit';
import { MessagesHTMLUtils } from '../utils/messages.html.utils';

class UserService {
  private userDAL: UserDAL;
  private email: EmailUtils;
  private requestRateLimit: RequestRateLimitUtils;
  private messagesHTMLUtils: MessagesHTMLUtils;
  private invalidAttempts: Map<string, number>;

  constructor() {
    this.userDAL = new UserDAL();
    this.email = new EmailUtils();
    this.requestRateLimit = new RequestRateLimitUtils();
    this.messagesHTMLUtils = new MessagesHTMLUtils();
    this.invalidAttempts = new Map();
  }

  async create({ name, email, password }: usersInterfaces.ICreateUser) {
    const findUser = await this.userDAL.findUserByEmail(email);
    if (findUser) {
      throw new errorHelpers.BadRequestError({
        message: 'User already exists',
      });
    }

    const validateInput = userZSchemas.createSchemaUser.parse({
      name,
      email,
      password,
    });
    const hashPassword = await hash(validateInput.password, 10);
    const create = await this.userDAL.create({
      name: validateInput.name,
      email: validateInput.email,
      password: hashPassword,
    });

    const emailData = await this.email.sendEmail({
      inviteTo: email,
      subject: 'Bem Vindo!!!',
      html: this.messagesHTMLUtils.createAccount(name),
    });

    return { create, emailData };
  }

  async auth({ email, password }: usersInterfaces.IAuthUser) {
    const validateInput = userZSchemas.authSchemaUser.parse({
      email,
      password,
    });
    const findUser = await this.userDAL.findUserByEmail(validateInput.email);
    if (!findUser) {
      throw new errorHelpers.NotFoundError({
        message: 'Invalid email or password',
      });
    }

    const passwordMatch = await compare(
      validateInput.password,
      findUser.password
    );
    if (!passwordMatch) {
      throw new errorHelpers.BadRequestError({
        message: 'Invalid email or password',
      });
    }

    let secretKeyRefreshToken: string = env.ACCESS_KEY_TOKEN_REFRESH;
    let secretKey: string = env.ACCESS_KEY_TOKEN;
    if (!secretKey || !secretKeyRefreshToken) {
      throw new errorHelpers.VariantAlsoNegotiatesError({
        message: 'There is no token key or refresh token key',
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
      tokenKeys: {
        token: {
          code: token,
          expiresIn: '60s',
        },
        refreshToken: {
          code: refreshToken,
          expiresIn: '7d',
        },
      },
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new errorHelpers.BadRequestError({
        message: 'Refresh token missing',
      });
    }

    let secretKeyRefreshToken: string = env.ACCESS_KEY_TOKEN_REFRESH;
    let secretKey: string = env.ACCESS_KEY_TOKEN;
    if (!secretKey || !secretKeyRefreshToken) {
      throw new errorHelpers.VariantAlsoNegotiatesError({
        message: 'There is no token key or refresh token key',
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

  async update({
    oldPassword,
    newPassword,
    user_id,
    name,
  }: usersInterfaces.IUpdateUser) {
    if (oldPassword && newPassword) {
      const findUserById = await this.userDAL.findUserById(user_id);
      if (!findUserById) {
        throw new errorHelpers.NotFoundError({ message: 'User not found' });
      }

      const passwordMatch = await compare(oldPassword, findUserById.password);
      if (!passwordMatch) {
        throw new errorHelpers.BadRequestError({
          message: 'Old password invalid',
        });
      }

      const validateInput = userZSchemas.updateSchemaUser.parse({
        name,
        oldPassword,
        newPassword,
        user_id,
      });
      const password = await hash(validateInput.newPassword, 10);
      const result = await this.userDAL.update({
        newPassword: password,
        user_id: validateInput.user_id,
        name: validateInput.name,
      });

      return {
        result,
        message: 'User updated successfully',
      };
    } else {
      throw new errorHelpers.BadRequestError({
        message: 'Fill in the fields correctly',
      });
    }
  }

  async forgotPassword({ email, ip }: usersInterfaces.IForgotPassword) {
    if (ip === undefined) {
      throw new errorHelpers.NotFoundError({ message: 'Cannot find ip' });
    }
    if (this.requestRateLimit.checkIfTheIpIsBlocked(ip)) {
      throw new errorHelpers.TooManyRequestsError({
        message: 'Too many requests. This IP has been blocked for 15 minutes',
      });
    }

    const findUser = await this.userDAL.findUserByEmail(email);

    if (!findUser) {
      const attempts = this.invalidAttempts.get(ip) || 0;
      this.invalidAttempts.set(ip, attempts + 1);
      if (attempts + 1 === 3) this.requestRateLimit.blockedIP(ip);

      throw new errorHelpers.NotFoundError({ message: 'User not found' });
    }

    const oneHours: number = 3600000;
    const resetToken = await hash(findUser.email + Date.now(), 10);
    const resetTokenExpiry = new Date(Date.now() + oneHours);

    const validateInput = userZSchemas.updateResetTokenSchemaUser.parse({
      resetToken,
      resetTokenExpiry,
      email: findUser.email,
    });

    const token = await this.userDAL.updateResetToken({
      resetToken: validateInput.resetToken,
      resetTokenExpiry: validateInput.resetTokenExpiry,
      email: validateInput.email,
    });

    if (!token.resetToken) {
      throw new errorHelpers.InternalServerError({
        message: 'Without password recovery token',
      });
    }

    const replaceInHTML = this.messagesHTMLUtils.forgotPassword({
      name: findUser.name,
      token: token.resetToken,
    });
    const emailData = await this.email.sendEmail({
      inviteTo: email,
      subject: 'Recuperação de Senha!!!',
      html: replaceInHTML,
    });

    return emailData;
  }

  async recoveryPassword({
    resetToken,
    newPassword,
  }: usersInterfaces.IRecoveryPassword) {
    const findUser = await this.userDAL.findUserByToken(resetToken);

    if (!findUser)
      throw new errorHelpers.NotFoundError({
        message: 'User by token not found',
      });

    const now = new Date();

    if (findUser.resetTokenExpiry && now > findUser.resetTokenExpiry) {
      throw new errorHelpers.UnauthorizedError({ message: 'Token expired' });
    }

    const validateInput = userZSchemas.recoveryPasswordSchemaUser.parse({
      newPassword,
    });

    const hashedPassword = await hash(validateInput.newPassword, 10);

    const result = await this.userDAL.updatePassword({
      newPassword: hashedPassword,
      email: findUser.email,
    });

    return result;
  }
}

export { UserService };
