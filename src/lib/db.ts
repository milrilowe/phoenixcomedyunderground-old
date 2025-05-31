import { PrismaClient } from '@prisma/client'

// Create prisma client singleton with better error handling
let prismaClient: PrismaClient | undefined

export function getDB(): PrismaClient {
    if (!prismaClient) {
        try {
            prismaClient = new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            })
        } catch (error) {
            console.error('Failed to initialize Prisma client:', error)
            throw new Error('Database connection failed')
        }
    }
    return prismaClient
}

export const db = getDB()

// Graceful shutdown
process.on('beforeExit', async () => {
    if (prismaClient) {
        await prismaClient.$disconnect()
    }
})