import { z } from 'zod';

export const createSchemaSchedules = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  phone: z.string(),
  date: z.date(),
  user_id: z.string().uuid(),
  description: z.string(),
});

export const findSchemaSchedules = z.object({
  date: z.date(),
  user_id: z.string().uuid(),
});

export const updateSchemaSchedule = z.object({
  id: z.string().uuid(),
  date: z.date(),
  phone: z.string(),
  description: z.string(),
  user_id: z.string().uuid(),
});
