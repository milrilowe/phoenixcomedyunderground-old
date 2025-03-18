// app/lib/actions/shows.ts
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { showsService } from '@/lib/services/shows'
import { showIdSchema, showCreateSchema, showUpdateSchema } from '@/lib/schemas/shows'

// Get all shows
export const fetchShows = createServerFn({ method: 'GET' })
    .handler(async () => {
        return showsService.getAll()
    })

// Get upcoming shows
export const fetchUpcomingShows = createServerFn({ method: 'GET' })
    .handler(async () => {
        return showsService.getUpcoming()
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
        return showsService.create(data)
    })

// Update a show
export const updateShow = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showUpdateSchema.parse(data)
    })
    .handler(async ({ data }) => {
        const { id, ...updateData } = data

        const show = await showsService.update(id, updateData)

        if (!show) {
            throw notFound()
        }

        return show
    })

// Delete a show
export const deleteShow = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return showIdSchema.parse(data)
    })
    .handler(async ({ data: showId }) => {
        await showsService.delete(showId)
        return { success: true }
    })