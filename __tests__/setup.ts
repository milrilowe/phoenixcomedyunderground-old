import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock TanStack's createServerFn
vi.mock('@tanstack/react-start', () => {
    return {
        createServerFn: () => {
            return {
                validator: () => ({
                    handler: (fn) => fn,
                }),
                handler: (fn) => fn,
            }
        },
    }
})