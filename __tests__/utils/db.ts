import { vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock the whole prisma module
vi.mock('@prisma/client', () => {
    const mockPrismaClient = vi.fn().mockImplementation(() => ({
        message: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        subscriber: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    }))

    return {
        PrismaClient: mockPrismaClient,
    }
})

// Re-export a type-safe mock client
export const mockPrisma = new PrismaClient() as unknown as {
    message: {
        create: ReturnType<typeof vi.fn>;
        findMany: ReturnType<typeof vi.fn>;
        findUnique: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };
    subscriber: {
        create: ReturnType<typeof vi.fn>;
        findMany: ReturnType<typeof vi.fn>;
        findUnique: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };
    $disconnect: ReturnType<typeof vi.fn>;
}