import { z } from 'zod';

export const createSchemaSchedule = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  phone: z.string(),
  date: z.coerce.date(),
  user_id: z.string().uuid(),
  description: z.string(),
});

export const updateSchemaSchedule = z.object({
  id: z.string().uuid(),
  date: z.coerce.date(),
  phone: z.string(),
  description: z.string(),
  user_id: z.string().uuid(),
});
