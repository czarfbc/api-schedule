import { z } from 'zod';

const envSchema = z.object({
  //SERVER
  DATABASE_URL: z.string().url(),
  ACCESS_KEY_TOKEN: z.string(),
  ACCESS_KEY_TOKEN_REFRESH: z.string(),
  PORT: z.coerce.number(),

  //EMAIL
  RESEND_KEY: z.string(),
  HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  USER: z.string(),
  PASS: z.string(),
  NODEMAILER_EMAIL: z.string(),
});

export const env = envSchema.parse(process.env);
