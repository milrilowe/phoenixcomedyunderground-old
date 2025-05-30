import type { SubscribeInput } from '../schemas/subscribers';

export async function subscribe({ data }: { data: SubscribeInput }) {
    const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Subscription failed');
    }

    return await response.json();
}