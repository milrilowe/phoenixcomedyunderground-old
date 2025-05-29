import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { showsService } from '@/lib/services/shows'
import { showIdSchema, showCreateSchema, showUpdateSchema, showStatusEnum } from '@/lib/schemas/shows'
import { z } from 'zod'

// Get all shows
export const fetchShows = createServerFn({ method: 'GET' })
    .handler(async ({ }) => {
        return showsService.getAll()
    })

// Get all shows with admin options (including unpublished)
export const fetchAllShowsAdmin = createServerFn({ method: 'GET' })
    .handler(async () => {
        return showsService.getAll({ includeUnpublished: true })
    })

// Get upcoming shows
export const fetchUpcomingShows = createServerFn({ method: 'GET' })
    .validator((data?: unknown) => {
        return z.object({
            limit: z.number().int().optional(),
            featuredOnly: z.boolean().optional(),
            excludeSoldOut: z.boolean().optional()
        }).optional().parse(data || {})
    })
    .handler(async ({ data }) => {
        return showsService.getUpcoming(data)
    })

// Get featured shows
export const fetchFeaturedShows = createServerFn({ method: 'GET' })
    .validator((data?: unknown) => {
        return z.object({
            limit: z.number().int().optional()
        }).optional().parse(data || {})
    })
    .handler(async ({ data }) => {
        return showsService.getFeatured(data?.limit)
    })

// Get past shows
export const fetchPastShows = createServerFn({ method: 'GET' })
    .validator((data?: unknown) => {
        return z.object({
            limit: z.number().int().optional(),
            offset: z.number().int().optional()
        }).optional().parse(data || {})
    })
    .handler(async ({ data }) => {
        return showsService.getPast(data)
    })

// Get a single show
export const fetchShow = createServerFn({ method: 'GET' })
    .validator((data: unknown) => {
        return showIdSchema.parse(data)
    })
    .handler(async ({ data: showId }) => {
        const show = await showsService.getById(showId)

        if (!show) {
            throw notFound()
        }

        return show
    })

// Create a new show
export const createShow = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showCreateSchema.parse(data)
    })
    .handler(async ({ data }) => {
        try {
            const show = await showsService.create(data)
            return {
                success: true,
                show
            }
        } catch (error) {
            console.error('Error creating show:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Update a show
export const updateShow = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showUpdateSchema.parse(data)
    })
    .handler(async ({ data }) => {
        try {
            const { id, ...updateData } = data
            const show = await showsService.update(id, updateData)

            return {
                success: true,
                show
            }
        } catch (error) {
            console.error('Error updating show:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Delete a show
export const deleteShow = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showIdSchema.parse(data)
    })
    .handler(async ({ data: showId }) => {
        try {
            await showsService.delete(showId)
            return { success: true }
        } catch (error) {
            console.error('Error deleting show:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Update show status
export const updateShowStatus = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return z.object({
            id: showIdSchema,
            status: showStatusEnum
        }).parse(data)
    })
    .handler(async ({ data }) => {
        try {
            const show = await showsService.updateStatus(data.id, data.status)
            return {
                success: true,
                show
            }
        } catch (error) {
            console.error('Error updating show status:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Toggle featured status
export const toggleShowFeatured = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showIdSchema.parse(data)
    })
    .handler(async ({ data: showId }) => {
        try {
            const show = await showsService.toggleFeatured(showId)
            return {
                success: true,
                show
            }
        } catch (error) {
            console.error('Error toggling featured status:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Toggle published status
export const toggleShowPublished = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showIdSchema.parse(data)
    })
    .handler(async ({ data: showId }) => {
        try {
            const show = await showsService.togglePublished(showId)
            return {
                success: true,
                show
            }
        } catch (error) {
            console.error('Error toggling published status:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Update sold tickets count
export const updateShowSoldTickets = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return z.object({
            id: showIdSchema,
            soldTickets: z.number().int().nonnegative()
        }).parse(data)
    })
    .handler(async ({ data }) => {
        try {
            const show = await showsService.updateSoldTickets(data.id, data.soldTickets)
            return {
                success: true,
                show
            }
        } catch (error) {
            console.error('Error updating sold tickets:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })