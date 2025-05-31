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
            const result = await db.subscriber.create({
                data,
                // No select - returns all fields
            })
            return {
                id: result.id,
                email: result.email,
                source: result.source
            }
        } catch (error) {
            console.error("Error creating subscriber:", error)
            throw error
        }
    },
}