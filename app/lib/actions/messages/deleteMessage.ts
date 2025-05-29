import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { messagesService } from "@/lib/services/messages"


/**
 * 
 * Remove a message by its ID.
 * 
 */
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