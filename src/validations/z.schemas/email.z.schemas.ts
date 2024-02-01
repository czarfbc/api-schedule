import { z } from 'zod';

export const emailSchema = z.object({
  inviteTo: z.string().email(),
  subject: z.string(),
  html: z.string(),
});
