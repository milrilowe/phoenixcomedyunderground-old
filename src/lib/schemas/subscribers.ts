import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;