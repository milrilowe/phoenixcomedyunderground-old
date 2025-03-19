import { z } from 'zod'

export const messageSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please provide a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters')
})

export type MessageInput = z.infer<typeof messageSchema>