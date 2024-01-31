import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorsHelpers } from '../helpers/errors.helpers';

export const errorsMiddleware = (
  error: Error & Partial<ErrorsHelpers>,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : 'Internal Server Error';

  if (error instanceof ZodError) {
    const validationErrors = error.errors.map((err) => err.message);
    return response
      .status(400)
      .json({ statusCode: 400, message: validationErrors });
  }

  return response.status(statusCode).json({ statusCode, message });
};
