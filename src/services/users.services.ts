import { compare, hash } from 'bcrypt';
import { ICreate, IUpdate } from '../interfaces/users.interface';
import { UsersRepository } from '../repositories/users.repository';
import { sign, verify } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

class UsersServices {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    if (findUser) {
      throw new Error('Usuário já existe');
    }

    const resend = new Resend('re_Y7MRdSEb_9NS2cecFqRNsLhZeEpsGphQi');
    const emailData = await resend.emails.send({
      from: 'ScheduleSystem <onboarding@resend.dev>',
      to: email,
      subject: 'Bem vindo!!!',
      html: `<h1>Olá ${name}, seja bem vindo ao nosso sistema</h1>`,
    });

    const hashPassword = await hash(password, 10);
    const create = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return { create, emailData };
  }

  async update({ oldPassword, newPassword, user_id, name }: IUpdate) {
    if (oldPassword && newPassword) {
      const findUserById = await this.usersRepository.findUserById(user_id);
      if (!findUserById) {
        throw new Error('Usuário não encontrado');
      }

      const passwordMatch = await compare(oldPassword, findUserById.password);
      if (!passwordMatch) {
        throw new Error('Senha inválida');
      }

      const password = await hash(newPassword, 10);

      const result = await this.usersRepository.update({
        newPassword: password,
        user_id,
        name,
      });

      return {
        result,
        message: 'Usuário atualizado com sucesso',
      };
    } else {
      throw new Error('Preencha os campos corretamente');
    }
  }

  async auth(email: string, password: string) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error('Usuário ou senha invalido');
    }

    const passwordMatch = await compare(password, findUser.password);
    if (!passwordMatch) {
      throw new Error('Usuário ou senha invalido');
    }

    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
    if (!secretKey) {
      throw new Error('Não há chave de token');
    }
    let secretKeyRefreshToken: string | undefined =
      process.env.ACCESS_KEY_TOKEN_REFRESH;
    if (!secretKeyRefreshToken) {
      throw new Error('Não há chave de token');
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
      throw new Error('Refresh token ausente');
    }
    let secretKeyRefreshToken: string | undefined =
      process.env.ACCESS_KEY_TOKEN_REFRESH;
    if (!secretKeyRefreshToken) {
      throw new Error('Não há chave de refresh token');
    }

    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
    if (!secretKey) {
      throw new Error('Não há chave de refresh token');
    }

    const verifyRefreshToken = await verify(
      refresh_token,
      secretKeyRefreshToken
    );

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
      throw new Error('Usuário não encontrado');
    }

    const randomToken = await randomBytes(20).toString('hex');

    const token = sign({ email }, randomToken, {
      subject: findUser.id,
      expiresIn: '1h',
    });

    const resend = new Resend('re_Y7MRdSEb_9NS2cecFqRNsLhZeEpsGphQi');
    const emailData = await resend.emails.send({
      from: 'ScheduleSystem <onboarding@resend.dev>',
      to: email,
      subject: 'Bem vindo!!!',
      html: `<p>Utilize o seguinte codigo para atualizar a senha  <strong>${token}</strong></p>`,
    });

    return { token, emailData };
  }
}
export { UsersServices };
