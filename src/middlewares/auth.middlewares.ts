import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IPayload } from '../validations/interfaces/services/user.interfaces';
import { env } from '../validations/z.schemas/env.z.schemas';
import { VariantAlsoNegotiatesError } from '../helpers/error.helpers';

class AuthMiddlewares {
  handleAuth(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({
        code: 'token.missing',
        message: 'Token missing',
      });
    }

    const [, token] = authHeader.split(' ');

    const secretkey: string = env.ACCESS_KEY_TOKEN;
    if (!secretkey) {
      throw new VariantAlsoNegotiatesError({
        message: 'There is no token key',
      });
    }

    try {
      const { sub } = verify(token, secretkey) as IPayload;
      request.user_id = sub;
      return next();
    } catch (error) {
      return response.status(401).json({
        code: 'token.expired',
        message: 'Token expired',
      });
    }
  }
}

export { AuthMiddlewares };
