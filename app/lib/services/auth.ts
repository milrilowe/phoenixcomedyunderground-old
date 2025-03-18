import { compareSync, hashSync } from 'bcryptjs'
import { db } from '@/lib/db'
import type { LoginInput, RegisterInput } from '@/lib/schemas/auth'


export const authService = {
    async login({ email, password }: LoginInput) {
        const user = await db.user.findUnique({
            where: { email }
        })

        if (!user) {
            return null
        }

        const isValidPassword = compareSync(password, user.password)

        if (!isValidPassword) {
            return null
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    },

    async register({ email, password, name }: RegisterInput) {
        // Hash password
        const hashedPassword = hashSync(password, 10);

        // Create new user
        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        // Return user without password
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    },

    async getUserById(id: number) {
        if (!id) {
            return null
        }

        const user = await db.user.findUnique({
            where: { id }
        })

        if (!user) {
            return null
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    },

    // Added this function to check if email exists
    async emailExists(email: string) {
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true } // Only fetch the ID for efficiency
        })

        return user !== null
    }
}