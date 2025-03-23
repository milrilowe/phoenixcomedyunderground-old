// app/lib/services/shows.ts
import { db } from '@/lib/db'
import type { Prisma, Show } from '@prisma/client'
import type { ShowCreate } from '@/lib/schemas/shows'

export const showsService = {
    /**
     * Get all shows with optional filtering and sorting
     */
    async getAll(options?: {
        includeUnpublished?: boolean,
        orderBy?: 'date' | 'title' | 'createdAt',
        order?: 'asc' | 'desc'
    }) {
        const { includeUnpublished = false, orderBy = 'date', order = 'asc' } = options || {}
        
        return db.show.findMany({
            where: includeUnpublished ? undefined : { published: true },
            orderBy: { [orderBy]: order },
        })
    },

    /**
     * Get a show by its ID
     */
    async getById(id: number) {
        return db.show.findUnique({
            where: { id },
        })
    },

    /**
     * Get all upcoming shows (shows with a date in the future)
     */
    async getUpcoming(options?: { 
        limit?: number, 
        featuredOnly?: boolean,
        excludeSoldOut?: boolean
    }) {
        const { limit, featuredOnly = false, excludeSoldOut = false } = options || {}
        const now = new Date()
        
        const where: Prisma.ShowWhereInput = {
            date: { gte: now },
            published: true,
            ...(featuredOnly ? { featured: true } : {}),
            ...(excludeSoldOut ? { NOT: { status: 'soldout' } } : {})
        }
        
        return db.show.findMany({
            where,
            orderBy: { date: 'asc' },
            ...(limit ? { take: limit } : {})
        })
    },

    /**
     * Get featured shows
     */
    async getFeatured(limit = 3) {
        const now = new Date()
        return db.show.findMany({
            where: {
                featured: true,
                date: { gte: now },
                published: true
            },
            orderBy: { date: 'asc' },
            take: limit
        })
    },

    /**
     * Get past shows
     */
    async getPast(options?: { limit?: number, offset?: number }) {
        const { limit, offset } = options || {}
        const now = new Date()
        
        return db.show.findMany({
            where: {
                date: { lt: now },
                published: true
            },
            orderBy: { date: 'desc' },
            ...(limit ? { take: limit } : {}),
            ...(offset ? { skip: offset } : {})
        })
    },

    /**
     * Create a new show
     */
    async create(data: ShowCreate): Promise<Show> {
        // Convert string dates to Date objects
        const preparedData: Prisma.ShowCreateInput = {
            ...data,
            date: new Date(data.date),
            time: new Date(data.time),
            endTime: data.endTime ? new Date(data.endTime) : undefined,
            price: data.price ? parseFloat(data.price.toString()) : undefined,
        }

        return db.show.create({
            data: preparedData,
        })
    },

    /**
     * Update an existing show
     */
    async update(id: number, data: Partial<ShowCreate>): Promise<Show> {
        const updateData: Prisma.ShowUpdateInput = { ...data }

        // Convert string dates to Date objects if present
        if (data.date) updateData.date = new Date(data.date)
        if (data.time) updateData.time = new Date(data.time)
        if (data.endTime) updateData.endTime = new Date(data.endTime)
        if (data.price) updateData.price = parseFloat(data.price.toString())

        return db.show.update({
            where: { id },
            data: updateData,
        })
    },

    /**
     * Delete a show
     */
    async delete(id: number): Promise<Show> {
        return db.show.delete({
            where: { id },
        })
    },

    /**
     * Update show status (scheduled, cancelled, soldout)
     */
    async updateStatus(id: number, status: 'scheduled' | 'cancelled' | 'soldout'): Promise<Show> {
        return db.show.update({
            where: { id },
            data: { status }
        })
    },

    /**
     * Toggle featured status of a show
     */
    async toggleFeatured(id: number): Promise<Show> {
        const show = await db.show.findUnique({ where: { id } })
        
        if (!show) {
            throw new Error(`Show with ID ${id} not found`)
        }
        
        return db.show.update({
            where: { id },
            data: { featured: !show.featured }
        })
    },

    /**
     * Toggle published status of a show
     */
    async togglePublished(id: number): Promise<Show> {
        const show = await db.show.findUnique({ where: { id } })
        
        if (!show) {
            throw new Error(`Show with ID ${id} not found`)
        }
        
        return db.show.update({
            where: { id },
            data: { published: !show.published }
        })
    },

    /**
     * Update the number of sold tickets
     */
    async updateSoldTickets(id: number, soldTickets: number): Promise<Show> {
        const show = await db.show.findUnique({ where: { id } })
        
        if (!show) {
            throw new Error(`Show with ID ${id} not found`)
        }
        
        // If we've sold all available tickets, mark as soldout
        const status = show.maxCapacity && soldTickets >= show.maxCapacity 
            ? 'soldout' 
            : show.status
        
        return db.show.update({
            where: { id },
            data: { 
                soldTickets,
                status
            }
        })
    }
}