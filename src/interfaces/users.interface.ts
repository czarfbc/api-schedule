export interface ICreate {
  name: string;
  email: string;
  password: string;
}
export interface IUpdate {
  name: string;
  oldPassword: string;
  newPassword: string;
  user_id: string;
}
interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
export interface IPayload {
  sub: string;
}
