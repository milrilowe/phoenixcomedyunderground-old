import { messagesService } from "@/lib/services/messages"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

/**
 * Mark a message as read by its ID.
 * 
 * @param messageId - The ID of the message to mark as read.
 * @returns A success response or an error message.
 */
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