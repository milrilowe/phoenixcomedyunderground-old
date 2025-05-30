import type { APIRoute } from 'astro';
import { subscribeSchema } from '@/lib/schemas/subscribers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate the data
    const validatedData = subscribeSchema.parse(data);
    
    // Check if already subscribed (implement your logic)
    const alreadySubscribed = false; // Replace with actual check
    
    if (alreadySubscribed) {
      return new Response(JSON.stringify({ 
        success: true, 
        alreadySubscribed: true 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add to your email service here
    // Example: await addToMailchimp(validatedData.email);
    
    return new Response(JSON.stringify({ 
      success: true, 
      alreadySubscribed: false 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Subscription failed' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};