import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ACCESS_KEY_TOKEN: z.string(),
  ACCESS_KEY_TOKEN_REFRESH: z.string(),
  RESEND_KEY: z.string(),
  PORT: z.string(),
});

export const env = envSchema.parse(process.env);
