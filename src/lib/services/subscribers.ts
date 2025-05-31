import { getDB } from '@/lib/db'
import type { SubscribeInput } from '@/lib/schemas/subscribers'

export const subscribersService = {
    async getAll() {
        const db = await getDB()
        return db.subscriber.findMany({
            orderBy: { createdAt: 'desc' },
        })
    },

    async getById(id: number) {
        const db = await getDB()
        return db.subscriber.findUnique({
            where: { id },
        })
    },

    async getByEmail(email: string) {
        const db = await getDB()
        return db.subscriber.findUnique({
            where: { email },
        })
    },

    async create(data: SubscribeInput) {
        try {
            const db = await getDB()
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