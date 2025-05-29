import { subscriberIdSchema } from "@/lib/schemas/subscribers"
import { subscribersService } from "@/lib/services/subscribers"
import { createServerFn } from "@tanstack/react-start"

export const deleteSubscriber = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return subscriberIdSchema.parse(data)
    })
    .handler(async ({ data: subscriberId }) => {
        await subscribersService.delete(subscriberId)
        return { success: true }
    })