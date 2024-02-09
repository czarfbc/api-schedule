import {
  IErrorsHelpers,
  IMoreErrorsHelpers,
} from '../validations/interfaces/helpers/errors.interfaces';

export class ErrorsHelpers extends Error {
  public readonly statusCode: number;

  constructor({ message, statusCode }: IErrorsHelpers) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ErrorsHelpers {
  constructor({ message }: IMoreErrorsHelpers) {
    super({ message, statusCode: 400 });
  }
}

export class UnauthorizedError extends ErrorsHelpers {
  constructor({ message }: IMoreErrorsHelpers) {
    super({ message, statusCode: 401 });
  }
}
export class NotFoundError extends ErrorsHelpers {
  constructor({ message }: IMoreErrorsHelpers) {
    super({ message, statusCode: 404 });
  }
}

export class TooManyRequestsError extends ErrorsHelpers {
  constructor({ message }: IMoreErrorsHelpers) {
    super({ message, statusCode: 429 });
  }
}

export class VariantAlsoNegotiatesError extends ErrorsHelpers {
  constructor({ message }: IMoreErrorsHelpers) {
    super({ message, statusCode: 506 });
  }
}
