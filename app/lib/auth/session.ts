import { useSession } from '@tanstack/react-start/server'
import type { User } from '@prisma/client'

type SessionUser = {
    userId: User['id']
    email: User['email']
    role: User['role']
}

export function useAppSession() {
    return useSession<SessionUser>({
        password: process.env.SESSION_SECRET || 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
    })
}