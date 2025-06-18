import type { APIRoute } from 'astro';
import { subscribeSchema } from '@/lib/schemas/subscribers';

// Explicitly disable prerendering for this route only
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // Validate the data
        const validatedData = subscribeSchema.parse(data);

        // Lazy load the database service to handle initialization issues
        const { subscribersService } = await import('@/lib/services/subscribers');

        // Check if already subscribed
        const existing = await subscribersService.getByEmail(validatedData.email);

        if (existing) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Already subscribed',
                alreadySubscribed: true
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const subscriber = await subscribersService.create(validatedData);

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully subscribed',
            subscriber
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        // Handle specific Prisma initialization error
        if (error instanceof Error && error.message.includes('Prisma client not generated')) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Database not initialized. Please contact support.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: false,
            error: 'Subscription failed'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};