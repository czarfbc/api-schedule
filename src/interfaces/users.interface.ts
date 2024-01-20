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

export interface IPayload {
  sub: string;
}
