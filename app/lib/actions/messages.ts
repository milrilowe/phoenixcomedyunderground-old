import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { messagesService } from '@/lib/services/messages'
import { messageSchema } from '@/lib/schemas/messages'
import { z } from 'zod'

// Send a message from the contact form
export const sendMessage = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return messageSchema.parse(data)
    })
    .handler(async ({ data }) => {
        try {
            const result = await messagesService.send(data)

            return {
                success: true,
                message: 'Message sent successfully',
                data: result
            }
        } catch (error) {
            console.error('Error sending message:', error)

            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// For admin - Get all messages
export const getMessages = createServerFn({ method: 'GET' })
    .handler(async () => {
        try {
            const messages = await messagesService.getAll()
            return { messages }
        } catch (error) {
            console.error('Error fetching messages:', error)
            return { messages: [] }
        }
    })

// For admin - Get a single message
export const getMessage = createServerFn({ method: 'GET' })
    .validator((data: unknown) => {
        return z.number().int().positive().parse(data)
    })
    .handler(async ({ data: messageId }) => {
        const message = await messagesService.getById(messageId)

        if (!message) {
            throw notFound()
        }

        return { message }
    })

// For admin - Mark a message as read
export const markMessageAsRead = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return z.number().int().positive().parse(data)
    })
    .handler(async ({ data: messageId }) => {
        try {
            await messagesService.markAsRead(messageId)
            return { success: true }
        } catch (error) {
            console.error('Error marking message as read:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// For admin - Delete a message
export const deleteMessage = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return z.number().int().positive().parse(data)
    })
    .handler(async ({ data: messageId }) => {
        try {
            await messagesService.delete(messageId)
            return { success: true }
        } catch (error) {
            console.error('Error deleting message:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })