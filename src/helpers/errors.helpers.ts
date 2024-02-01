import { IErrorsHelpers } from '../validations/interfaces/helpers/errors.interfaces';

class ErrorsHelpers extends Error {
  public readonly statusCode: number;

  constructor({ message, statusCode }: IErrorsHelpers) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ErrorsHelpers';
  }
}

export { ErrorsHelpers };
