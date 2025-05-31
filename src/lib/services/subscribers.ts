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
        const db = await getDB()
        const result = await db.subscriber.create({
            data,
        })
        return {
            id: result.id,
            email: result.email,
            source: result.source
        }
    },
}