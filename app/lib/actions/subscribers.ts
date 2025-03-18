import { createServerFn } from '@tanstack/react-start'
import { subscribersService } from '@/lib/services/subscribers'
import { emailSchema, subscribeSchema, subscriberIdSchema } from '@/lib/schemas/subscribers'

// Get all subscribers (admin function)
export const fetchSubscribers = createServerFn({ method: 'GET' })
    .handler(async () => {
        return subscribersService.getAll()
    })

// Subscribe to mailing list
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

// Unsubscribe from mailing list
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

// Admin function to delete a subscriber
export const deleteSubscriber = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return subscriberIdSchema.parse(data)
    })
    .handler(async ({ data: subscriberId }) => {
        await subscribersService.delete(subscriberId)
        return { success: true }
    })