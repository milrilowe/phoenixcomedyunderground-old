import { test, expect, beforeEach, vi, describe, it } from 'vitest'
import { sendMessage } from '@/lib/actions/messages'
import { messagesService } from '@/lib/services/messages'

// Mock the messagesService
vi.mock('@/lib/services/messages', () => ({
    messagesService: {
        send: vi.fn(),
        getAll: vi.fn(),
        getById: vi.fn(),
        markAsRead: vi.fn(),
        delete: vi.fn(),
    }
}))

// Mock TanStack's createServerFn
vi.mock('@tanstack/react-start', () => ({
    createServerFn: () => ({
        validator: () => ({
            handler: (fn) => fn,
        }),
        handler: (fn) => fn,
    })
}))

describe('Message Actions', () => {
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

    it('sendMessage should send a message successfully', async () => {
        // Setup mock service
        vi.mocked(messagesService.send).mockResolvedValue(mockMessage)

        // Execute the action
        const result = await sendMessage({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message'
            }
        })

        // Verify the service was called correctly
        expect(messagesService.send).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message'
        })

        // Verify the result
        expect(result).toEqual({
            success: true,
            message: 'Message sent successfully',
            data: mockMessage
        })
    })

    it('sendMessage should handle service errors', async () => {
        // Setup mock service to throw an error
        const error = new Error('Service error')
        vi.mocked(messagesService.send).mockRejectedValue(error)

        // Execute the action
        const result = await sendMessage({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message'
            }
        })

        // Verify the result contains the error
        expect(result).toEqual({
            success: false,
            message: 'Service error'
        })
    })
})