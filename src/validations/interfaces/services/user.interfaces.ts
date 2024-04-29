export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUser {
  name: string;
  oldPassword?: string;
  newPassword: string;
  user_id: string;
}

export interface IAuthUser {
  email: string;
  password: string;
}

export interface IUserUpdateResetToken {
  resetToken: string;
  resetTokenExpiry: Date;
  email: string;
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
export interface IForgotPassword {
  email: string;
  ip: string | undefined;
}
