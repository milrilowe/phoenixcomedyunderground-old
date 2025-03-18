// app/lib/services/subscribers.ts
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import type { SubscribeInput } from '@/lib/schemas/subscribers'

export const subscribersService = {
    getAll() {
        return db.subscriber.findMany({
            orderBy: { createdAt: 'desc' },
        })
    },

    getById(id: number) {
        return db.subscriber.findUnique({
            where: { id },
        })
    },

    getByEmail(email: string) {
        return db.subscriber.findUnique({
            where: { email },
        })
    },

    async create(data: SubscribeInput) {
        try {
            // Explicitly select only what we need
            const result = await db.subscriber.create({
                data,
                select: {
                    id: true,
                    email: true,
                }
            })
            // Return a plain JavaScript object instead of the Prisma model
            return {
                id: result.id,
                email: result.email,
            }
        } catch (error) {
            console.error("Error creating subscriber:", error)
            throw error
        }
    },

    update(id: number, data: Prisma.SubscriberUpdateInput) {
        return db.subscriber.update({
            where: { id },
            data,
        })
    },

    delete(id: number) {
        return db.subscriber.delete({
            where: { id },
        })
    }
}