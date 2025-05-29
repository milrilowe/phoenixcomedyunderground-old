import { emailSchema } from "@/lib/schemas/subscribers"
import { subscribersService } from "@/lib/services/subscribers"
import { createServerFn } from "@tanstack/react-start"

/**
 * 
 * Unsubscribe from the mailing list
 * 
 */
export const unsubscribe = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return emailSchema.parse(data)
    })
    .handler(async ({ data: email }) => {
        const subscriber = await subscribersService.getByEmail(email)

        if (!subscriber) {
            return {
                success: false,
                message: 'Email not found in our mailing list'
            }
        }

        await subscribersService.delete(subscriber.id)

        return {
            success: true,
            message: 'Successfully unsubscribed'
        }
    })