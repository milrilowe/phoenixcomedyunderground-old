import type { PrismaClient } from '@prisma/client'

// Force dynamic import to ensure Prisma client is available
let prismaClient: PrismaClient | undefined

export async function getDB(): Promise<PrismaClient> {
    if (!prismaClient) {
        try {
            const { PrismaClient: PrismaClientClass } = await import('@prisma/client')
            prismaClient = new PrismaClientClass({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            })
        } catch (error) {
            console.error('Failed to initialize Prisma client:', error)
            throw new Error('Database connection failed - Prisma client not available')
        }
    }
    return prismaClient
}

// Graceful shutdown
if (typeof process !== 'undefined') {
    process.on('beforeExit', async () => {
        if (prismaClient) {
            await prismaClient.$disconnect()
        }
    })
}

// Export a helper to get a database instance
export async function withDB<T>(callback: (db: PrismaClient) => Promise<T>): Promise<T> {
    const db = await getDB()
    return callback(db)
}