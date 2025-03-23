// app/lib/schemas/shows.ts
import { z } from 'zod'

export const showIdSchema = z.number().int().positive('ID must be a positive integer')

export const showStatusEnum = z.enum(['scheduled', 'cancelled', 'soldout'])

export const showCreateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    time: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid time format'),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end time format').optional(),
    description: z.string().min(1, 'Description is required'),
    location: z.string().optional(),
    venue: z.string().optional(),
    price: z.union([z.number().min(0), z.string().transform(val => parseFloat(val))]).optional(),
    ticketUrl: z.string().url('Invalid URL format').optional(),
    performers: z.string().optional(),
    featured: z.boolean().optional().default(false),
    status: showStatusEnum.optional().default('scheduled'),
    maxCapacity: z.number().int().positive().optional(),
    soldTickets: z.number().int().nonnegative().optional(),
    image: z.string().optional(),
    published: z.boolean().optional().default(true)
})

export const showUpdateSchema = z.object({
    id: showIdSchema,
    title: z.string().min(1, 'Title is required').optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
    time: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid time format').optional(),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end time format').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    location: z.string().optional(),
    venue: z.string().optional(),
    price: z.union([z.number().min(0), z.string().transform(val => parseFloat(val))]).optional(),
    ticketUrl: z.string().url('Invalid URL format').optional(),
    performers: z.string().optional(),
    featured: z.boolean().optional(),
    status: showStatusEnum.optional(),
    maxCapacity: z.number().int().positive().optional(),
    soldTickets: z.number().int().nonnegative().optional(),
    image: z.string().optional(),
    published: z.boolean().optional()
})

// Types derived from schemas
export type ShowId = z.infer<typeof showIdSchema>
export type ShowCreate = z.infer<typeof showCreateSchema>
export type ShowUpdate = z.infer<typeof showUpdateSchema>
export type ShowStatus = z.infer<typeof showStatusEnum>