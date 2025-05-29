import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { messagesService } from "@/lib/services/messages"


/**
 * Get a message by its ID.
 */
export const byId = createServerFn({ method: 'GET' })
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