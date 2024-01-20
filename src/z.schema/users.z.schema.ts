import { z } from 'zod';

export const createSchemaUsers = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateSchemaUsers = z.object({
  name: z.string().min(3),
  oldPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8),
  user_id: z.string().uuid(),
});

export const payloadSchema = z.object({
  sub: z.string(),
});
