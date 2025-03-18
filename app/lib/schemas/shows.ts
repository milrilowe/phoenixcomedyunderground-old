import { z } from 'zod'

export const showIdSchema = z.number().int().positive('ID must be a positive integer')

export const showCreateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    time: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid time format'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().optional(),
    image: z.string() // Required per your schema
})

export const showUpdateSchema = z.object({
    id: showIdSchema,
    title: z.string().min(1, 'Title is required').optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
    time: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid time format').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    location: z.string().optional(),
    image: z.string().optional()
})

// Types derived from schemas
export type ShowId = z.infer<typeof showIdSchema>
export type ShowCreate = z.infer<typeof showCreateSchema>
export type ShowUpdate = z.infer<typeof showUpdateSchema>