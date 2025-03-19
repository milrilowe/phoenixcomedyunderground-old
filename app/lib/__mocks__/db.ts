import { PrismaClient } from '@prisma/client'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// Create a deep mock of PrismaClient
const mockPrismaClient = mockDeep<PrismaClient>()

// Mock the getDB function to return our mock client
export function getDB(): PrismaClient {
    return mockPrismaClient
}

// Export the mock client directly for test usage
export const db = mockPrismaClient

// Reset all mocks before each test
beforeEach(() => {
    mockReset(mockPrismaClient)
})