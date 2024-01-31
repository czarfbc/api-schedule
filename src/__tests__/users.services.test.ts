import { UsersServices } from '../services/users.services';
import { UsersRepository } from '../repositories/users.repository';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

jest.mock('../repositories/users.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UsersServices', () => {
  let usersServices: UsersServices;
  let mockUsersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockUsersRepository = new UsersRepository() as any;
    usersServices = new UsersServices();
    (usersServices as any).usersRepository = mockUsersRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw an error if email already exists', async () => {
      mockUsersRepository.findUserByEmail.mockResolvedValueOnce({} as any);
      await expect(
        usersServices.create({
          name: 'name-test',
          email: 'email-test',
          parssword: 'password-test',
        } as any)
      ).rejects.toThrow('User already exists');
    });

    const dateCreatedAt = new Date();
    const dateUpdatedAt = new Date();
    it('should create a new user', async () => {
      mockUsersRepository.findUserByEmail.mockResolvedValueOnce(null);
      (hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      mockUsersRepository.create.mockResolvedValueOnce({
        id: 'uuid',
        email: 'test@test.com',
        name: 'name',
        password: 'hashedPassword',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: dateCreatedAt,
        updatedAt: dateUpdatedAt,
      });

      const result = await usersServices.create({
        email: 'test@test.com',
        password: 'password',
        name: 'name',
      });
      expect(result).toEqual({
        create: {
          id: 'uuid',
          email: 'test@test.com',
          name: 'name',
          password: 'hashedPassword',
          resetToken: null,
          resetTokenExpiry: null,
          createdAt: dateCreatedAt,
          updatedAt: dateUpdatedAt,
        },
        emailData: {
          data: null,
          error: {
            message:
              'You can only send testing emails to your own email address (cezarfbc@gmail.com).',
            name: 'validation_error',
            statusCode: 403,
          },
        },
      });
    });
  });

  describe('auth', () => {
    it('should throw an error if invalid email', async () => {
      mockUsersRepository.findUserByEmail.mockResolvedValueOnce(null);
      await expect(
        usersServices.auth({
          email: 'email@test.com',
          password: 'password-test',
        } as any)
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if invalid password', async () => {
      mockUsersRepository.findUserByEmail.mockResolvedValueOnce({
        password: 'hashedPassword',
      } as any);
      (hash as jest.Mock).mockResolvedValueOnce(false);
      await expect(
        usersServices.auth({
          email: 'email@test.com',
          password: 'password',
        } as any)
      ).rejects.toThrow('Invalid email or password');
    });

    it('should auth user', async () => {
      const mockUser = {
        id: 'uuid',
        email: 'test@test.com',
        name: 'name',
        password: 'hashedPassword',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      (sign as jest.Mock).mockReturnValueOnce(mockAccessToken);
      (sign as jest.Mock).mockReturnValueOnce(mockRefreshToken);

      const result = await usersServices.auth({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({
        token: { token: mockAccessToken, expiresIn: '60s' },
        refreshToken: { refreshToken: mockRefreshToken, expiresIn: '7d' },
        user: {
          email: 'test@test.com',
          name: 'name',
        },
      });
    });
  });

  describe('refresh', () => {
    it('should throw an error if refresh token missing', async () => {
      await expect(usersServices.refresh('')).rejects.toThrow(
        'Refresh token missing'
      );
    });

    it('should throw an error if dont have refresh token', async () => {
      (verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('There is no refresh token key');
      });

      await expect(
        usersServices.refresh('mockInvalidRefreshToken')
      ).rejects.toThrow('There is no refresh token key');
    });

    it('should throw an error if dont have token', async () => {
      (verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('There is no token key');
      });

      await expect(
        usersServices.refresh('mockInvalidRefreshToken')
      ).rejects.toThrow('There is no token key');
    });

    it('should refresh token', async () => {
      const mockRefreshToken = 'mockRefreshToken';

      (verify as jest.Mock).mockReturnValueOnce({ sub: '1' });

      const mockNewToken = 'mockNewToken';
      const mockNewRefreshToken = 'mockNewRefreshToken';

      (sign as jest.Mock).mockReturnValueOnce(mockNewToken);
      (sign as jest.Mock).mockReturnValueOnce(mockNewRefreshToken);

      const result = await usersServices.refresh(mockRefreshToken);

      expect(result).toEqual({
        token: {
          token: mockNewToken,
          expiresIn: '1h',
        },
        refreshToken: {
          refreshToken: mockNewRefreshToken,
          expiresIn: '7d',
        },
      });
    });
  });

  describe('update', () => {
    it('should throw an error user not found', async () => {
      mockUsersRepository.findUserById.mockResolvedValueOnce(null);
      await expect(
        usersServices.update({
          user_id: 'uuid',
          name: 'name',
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        })
      ).rejects.toThrow('User not found');
    });

    it('should throw an error old password invalid', async () => {
      mockUsersRepository.findUserById.mockResolvedValueOnce({} as any);
      (compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(
        usersServices.update({
          user_id: 'uuid',
          name: 'name',
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        })
      ).rejects.toThrow('Old password invalid');
    });

    const dateCreatedAt = new Date();
    const dateUpdatedAt = new Date();
    it('should update user', async () => {
      mockUsersRepository.findUserById.mockResolvedValueOnce({
        id: '5d09d3cb-c933-4975-9fea-6d99113d908f',
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'czarfbc',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: dateCreatedAt,
        updatedAt: dateUpdatedAt,
      });

      (compare as jest.Mock).mockResolvedValueOnce(true);
      (hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      mockUsersRepository.update.mockResolvedValueOnce({
        id: '5d09d3cb-c933-4975-9fea-6d99113d908f',
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'czarfbc-updated',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: dateCreatedAt,
        updatedAt: dateUpdatedAt,
      });

      const result = await usersServices.update({
        user_id: '5d09d3cb-c933-4975-9fea-6d99113d908f',
        name: 'czarfbc-updated',
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      });

      expect(result).toEqual({
        result: {
          id: '5d09d3cb-c933-4975-9fea-6d99113d908f',
          email: 'test@test.com',
          password: 'hashedPassword',
          name: 'czarfbc-updated',
          resetToken: null,
          resetTokenExpiry: null,
          createdAt: dateCreatedAt,
          updatedAt: dateUpdatedAt,
        },
        message: 'User updated successfully',
      });
    });
  });

  describe('forgotPassword', () => {
    it('should throw an error user not found', async () => {
      const email = 'nonexistent@test.com';
      mockUsersRepository.findUserByEmail.mockResolvedValueOnce(null);
      await expect(usersServices.forgotPassword(email)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('recoveryPassword', () => {
    it('should throw an error token invalid', async () => {
      mockUsersRepository.findUserByToken.mockResolvedValueOnce(null as any);

      await expect(
        usersServices.recoveryPassword({
          resetToken: 'invalidToken',
          newPassword: 'newPassword',
        })
      ).rejects.toThrow('Token invalid');
    });

    it('should throw an error token expired', async () => {
      const expiredTokenUser = {
        id: 'uuid',
        email: 'expired@test.com',
        password: 'hashedPassword',
        name: 'Expired User',
        resetToken: null,
        resetTokenExpiry: new Date('2022-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findUserByToken.mockResolvedValueOnce(
        expiredTokenUser
      );

      mockUsersRepository.findUserByToken.mockResolvedValueOnce(
        expiredTokenUser
      );

      await expect(
        usersServices.recoveryPassword({
          resetToken: 'validToken',
          newPassword: 'newPassword',
        })
      ).rejects.toThrow('Token expired');
    });

    it('should update password', async () => {
      const validTokenUser = {
        id: 'uuid',
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        resetToken: null,
        resetTokenExpiry: new Date('3000-03-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findUserByToken.mockResolvedValueOnce(validTokenUser);

      const expectedUpdateResult = {
        id: 'uuid',
        email: 'test@test.com',
        password: 'hashedNewPassword',
        name: 'name',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        usersServices as any
      ).usersRepository.updatePassword.mockResolvedValueOnce(
        Promise.resolve(expectedUpdateResult)
      );

      const result = await usersServices.recoveryPassword({
        resetToken: 'validToken',
        newPassword: 'newPassword',
      });

      expect(result).toEqual(expectedUpdateResult);
    });
  });
});
