import { NextFunction, Request, Response } from 'express';

export type TCorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
