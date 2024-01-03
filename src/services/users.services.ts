import { compare, hash } from 'bcrypt';
import { ICreate, IUpdate } from '../interfaces/users.interface';
import { UsersRepository } from '../repositories/users.repository';
import { sign, verify } from 'jsonwebtoken';
import { Email } from '../utils/email';

class UsersServices {
  private usersRepository: UsersRepository;
  private email: Email;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.email = new Email();
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    if (findUser) {
      throw new Error('Usuário já existe');
    }

    const emailData = await this.email.sendEmail({
      inviteTo: email,
      subject: 'Bem Vindo!!!',
      html: `"<h1>Olá ${name}, seja bem vindo(a) ao seu novo sistema de agendamento</h1>`,
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
}
export { UsersServices };
