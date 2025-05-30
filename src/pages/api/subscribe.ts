// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { subscribeSchema } from '@/lib/schemas/subscribers';
import { subscribersService } from '@/lib/services/subscribers';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        
        // Validate the data
        const validatedData = subscribeSchema.parse(data);
        
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
        console.error('Subscription error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Subscription failed'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};