// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { subscribeSchema } from '@/lib/schemas/subscribers';

// Explicitly disable prerendering for this route only
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    console.log('API route called, attempting to initialize database...')

    try {
        const data = await request.json();
        console.log('Request data:', data)

        // Validate the data
        const validatedData = subscribeSchema.parse(data);
        console.log('Data validated:', validatedData)

        // Lazy load the database service to handle initialization issues
        console.log('Importing subscribers service...')
        const { subscribersService } = await import('@/lib/services/subscribers');
        console.log('Subscribers service imported successfully')

        // Check if already subscribed
        console.log('Checking for existing subscriber...')
        const existing = await subscribersService.getByEmail(validatedData.email);
        console.log('Existing check complete:', !!existing)

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

        console.log('Creating new subscriber...')
        const subscriber = await subscribersService.create(validatedData);
        console.log('Subscriber created:', subscriber)

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully subscribed',
            subscriber
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Subscription error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')

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