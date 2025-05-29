import { messagesService } from "@/lib/services/messages"
import { createServerFn } from "@tanstack/react-start"


/**
 * 
 * Fetch all messages
 * 
 */
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