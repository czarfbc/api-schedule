import { TCorsMiddleware } from '../validations/types/cors.types';

export const CorsConfig: TCorsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    'https://eat-eating-web-app.vercel.app',
    'http://localhost:3000',
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE, HEAD, PATCH'
  );
  next();
};
