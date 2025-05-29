import { createServerFn } from "@tanstack/react-start"
import { messageSchema } from "@/lib/schemas/messages"
import { messagesService } from "@/lib/services/messages"


/**
 * 
 * Send a message
 * 
 */
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
