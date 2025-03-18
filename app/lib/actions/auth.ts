// app/lib/actions/auth.ts
import { createServerFn } from '@tanstack/react-start'
import { authService } from '../services/auth'
import { loginSchema, registerSchema } from '../schemas/auth'
import { useAppSession } from '../auth/session'

// Login server action
export const login = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return loginSchema.parse(data)
    })
    .handler(async ({ data }) => {
        try {
            // Use service to handle login logic
            const user = await authService.login(data)

            if (!user) {
                return {
                    success: false,
                    message: 'Invalid email or password'
                }
            }

            // Create session FIRST, before returning any data
            const session = await useAppSession()
            session.update({
                userId: user.id,
                email: user.email,
                role: user.role || 'user',
            })

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Register server action
export const register = createServerFn({ method: 'POST' })
    .validator((data: unknown) => {
        return registerSchema.parse(data);
    })
    .handler(async ({ data }) => {
        try {
            // Check if email is already in use - use service
            const emailExists = await authService.emailExists(data.email);

            if (emailExists) {
                return {
                    success: false,
                    message: 'Email already in use'
                }
            }

            // Use service to handle registration
            const user = await authService.register(data);

            if (!user) {
                return {
                    success: false,
                    message: 'Failed to create account'
                }
            }

            // Create session
            const session = await useAppSession();

            session.update({
                userId: user.id,
                email: user.email,
                role: user.role || 'user',
            });

            return {
                success: true,
                user
            }

        } catch (error) {
            console.error('Registration error:', error);

            return {
                success: false,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
        }
    })

// Logout server action
export const logout = createServerFn({ method: 'POST' })
    .handler(async () => {
        try {
            const session = await useAppSession();
            session.clear();

            return {
                success: true
            }

        } catch (error) {
            console.error('Logout error:', error);

            return {
                success: false,
                message: 'Failed to logout'
            }
        }
    })

// Get current user server action
export const getCurrentUser = createServerFn({ method: 'GET' })
    .handler(async () => {
        try {
            const session = await useAppSession()
            const data = session.data;

            if (!data || !data.userId) {
                return { user: null }
            }

            return await authService.getUserById(data.userId);

        } catch (error) {
            console.error('Get current user error:', error);

            return { user: null }
        }
    })