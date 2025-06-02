import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ redirect }) => {
    return redirect('https://www.eventbrite.com/e/phoenix-comedy-underground-best-of-phoenix-showcase-tickets-1380218563879', 302);
};