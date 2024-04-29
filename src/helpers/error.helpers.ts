import * as errorInterfaces from '../validations/interfaces/helpers/error.interfaces';

class ErrorHelpers extends Error {
  public readonly statusCode: number;

  constructor({ message, statusCode }: errorInterfaces.IErrorHelpers) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends ErrorHelpers {
  constructor({ message }: errorInterfaces.IMoreErrorHelpers) {
    super({ message, statusCode: 400 });
  }
}

class UnauthorizedError extends ErrorHelpers {
  constructor({ message }: errorInterfaces.IMoreErrorHelpers) {
    super({ message, statusCode: 401 });
  }
}
class NotFoundError extends ErrorHelpers {
  constructor({ message }: errorInterfaces.IMoreErrorHelpers) {
    super({ message, statusCode: 404 });
  }
}

class TooManyRequestsError extends ErrorHelpers {
  constructor({ message }: errorInterfaces.IMoreErrorHelpers) {
    super({ message, statusCode: 429 });
  }
}

class InternalServerError extends ErrorHelpers {
  constructor({ message }: errorInterfaces.IMoreErrorHelpers) {
    super({ message, statusCode: 500 });
  }
}

class VariantAlsoNegotiatesError extends ErrorHelpers {
  constructor({ message }: errorInterfaces.IMoreErrorHelpers) {
    super({ message, statusCode: 506 });
  }
}

export {
  ErrorHelpers,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  TooManyRequestsError,
  InternalServerError,
  VariantAlsoNegotiatesError,
};
