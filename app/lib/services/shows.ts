// app/lib/services/shows.ts
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import type { ShowCreate } from '@/lib/schemas/shows'

export const showsService = {
    getAll() {
        return db.show.findMany({
            orderBy: { date: 'asc' },
        })
    },

    getById(id: number) {
        return db.show.findUnique({
            where: { id },
        })
    },

    getUpcoming() {
        const now = new Date()
        return db.show.findMany({
            where: {
                date: {
                    gte: now,
                },
            },
            orderBy: { date: 'asc' },
        })
    },

    create(data: ShowCreate) {
        // Convert string dates to Date objects
        return db.show.create({
            data: {
                ...data,
                date: new Date(data.date),
                time: new Date(data.time)
            },
        })
    },

    update(id: number, data: Partial<ShowCreate>) {
        const updateData: Prisma.ShowUpdateInput = { ...data }

        // Convert string dates to Date objects if present
        if (data.date) updateData.date = new Date(data.date)
        if (data.time) updateData.time = new Date(data.time)

        return db.show.update({
            where: { id },
            data: updateData,
        })
    },

    delete(id: number) {
        return db.show.delete({
            where: { id },
        })
    }
}