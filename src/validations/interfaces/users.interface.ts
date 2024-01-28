import { Users } from '@prisma/client';

export interface ICreateUsers {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUsers {
  name: string;
  oldPassword?: string;
  newPassword: string;
  user_id: string;
}

export interface IAuthUsers {
  email: string;
  password: string;
}

export interface IUsersUpdateResetToken {
  resetToken: string;
  resetTokenExpiry: Date;
  user: Users;
}

export interface IRecoveryPassword {
  resetToken: string;
  newPassword: string;
}

export interface IUpdatePassword {
  newPassword: string;
  email: string;
}

export interface IPayload {
  sub: string;
}
