import { test, expect, beforeEach, vi, it, describe } from 'vitest'
import { messagesService } from '@/lib/services/messages'
import { db } from '@/lib/db'

// Add this line to mock the db module
vi.mock('@/lib/db')

describe('Message Service', () => {
    const mockMessage = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('should create a new message', async () => {
        // Setup mock return value - fixed to use jest-style mocking
        (db.message.create as any).mockResolvedValue(mockMessage)

        // Call the service
        const result = await messagesService.send({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message',
        })

        // Verify the service calls Prisma correctly
        expect(db.message.create).toHaveBeenCalledWith({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message',
                read: false,
            }
        })

        // Verify the result
        expect(result).toEqual(mockMessage)
    })

    it('should handle errors when creating a message', async () => {
        // Setup mock to throw an error - fixed to properly set up rejection
        const error = new Error('Mock database error');

        (db.message.create as any).mockRejectedValue(error)

        // Call the service and expect it to throw
        await expect(messagesService.send({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message',
        })).rejects.toThrow('Database error')
    })
})