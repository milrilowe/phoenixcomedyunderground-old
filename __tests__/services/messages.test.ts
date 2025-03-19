import { test, expect, beforeEach, vi, it, describe } from 'vitest'
import { messagesService } from '@/lib/services/messages'
import { db } from '@/lib/db'

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
        // Setup mock return value
        vi.mocked(db.message.create).mockResolvedValue(mockMessage)

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
        // Setup mock to throw an error
        const error = new Error('Database error')
        vi.mocked(db.message.create).mockRejectedValue

        // Call the service and expect it to throw
        await expect(messagesService.send({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message',
        })).rejects.toThrow('Database error')
    })
})