import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorsHelpers } from '../helpers/errors.helpers';

class ErrorsMiddlewares {
  handleError(
    error: Error & Partial<ErrorsHelpers>,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map((err) => err.message);
      return response
        .status(400)
        .json({ statusCode: 400, message: validationErrors });
    }

    const statusCode = error.statusCode ?? 500;
    const message = error.statusCode ? error.message : 'Internal Server Error';

    return response.status(statusCode).json({ statusCode, message });
  }
}

export { ErrorsMiddlewares };
