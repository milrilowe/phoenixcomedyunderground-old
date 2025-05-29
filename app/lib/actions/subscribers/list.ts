import { subscribersService } from "@/lib/services/subscribers"
import { createServerFn } from "@tanstack/react-start"


/**
 * 
 * Fetch all subscribers
 * 
 */
export const fetchSubscribers = createServerFn({ method: 'GET' })
    .handler(async () => {
        return subscribersService.getAll()
    })
