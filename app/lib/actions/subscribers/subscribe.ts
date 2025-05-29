import { subscribeSchema } from "@/lib/schemas/subscribers"
import { subscribersService } from "@/lib/services/subscribers"
import { createServerFn } from "@tanstack/react-start"


/**
 * 
 * Subscribe to the mailing list
 * 
 */
export const subscribe = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return subscribeSchema.parse(data)
    })
    .handler(async ({ data }) => {
        // Check if already subscribed
        const existing = await subscribersService.getByEmail(data.email)

        if (existing) {
            return {
                success: true,
                message: 'Already subscribed',
                alreadySubscribed: true
            }
        }


        const subscriber = await subscribersService.create(data)

        return {
            success: true,
            message: 'Successfully subscribed',
            subscriber
        }
    })