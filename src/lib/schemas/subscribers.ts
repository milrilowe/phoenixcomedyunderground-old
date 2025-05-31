import { z } from 'zod'

export const emailSchema = z.string().email('Please provide a valid email address')

export const subscribeSchema = z.object({
    email: emailSchema,
    source: z.string().optional(),
})

export const subscriberIdSchema = z.number().int().positive('ID must be a positive integer')

// Types derived from schemas
export type SubscribeInput = z.infer<typeof subscribeSchema>
export type SubscriberId = z.infer<typeof subscriberIdSchema>