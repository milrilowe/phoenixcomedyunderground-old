import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Instagram } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { subscribe } from '@/lib/actions/subscribers';
import { subscribeSchema, SubscribeInput } from '@/lib/schemas/subscribers';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export function Mobile() {
    const [isPending, startTransition] = React.useTransition();
    const [buttonText, setButtonText] = React.useState<string>('Join');

    const form = useForm<SubscribeInput>({
        resolver: zodResolver(subscribeSchema),
        defaultValues: {
            email: '',
        }
    });

    async function onSubmit(data: SubscribeInput) {
        startTransition(async () => {
            try {
                const result = await subscribe({ data });

                if (result.alreadySubscribed) {
                    setButtonText('Already subscribed!');
                } else {
                    setButtonText('Welcome!');
                    form.reset();
                }

                // Clear message after 3 seconds
                setTimeout(() => setButtonText('Join'), 3000);
            } catch (error) {
                setButtonText('Try again');
                setTimeout(() => setButtonText('Join'), 3000);
            }
        });
    }

    return (
        <main className="min-h-screen relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:15px_15px]"></div>

            <div className="relative z-10">
                {/* Main viewport section */}
                <div className="h-screen flex flex-col">
                    {/* Title section - much smaller */}
                    <div className="text-center pt-6 pb-4 px-4">
                        <h1 className="text-2xl font-black text-zinc-900 leading-none tracking-tight mb-2">
                            AS ABOVE, SO BELOW
                        </h1>
                        <p className="text-sm text-zinc-700 font-medium uppercase tracking-wider">
                            Underground Comedy
                        </p>
                    </div>

                    {/* Flyer section with overlaid CTA - takes remaining space */}
                    <div className="flex-1 flex items-center justify-center px-4 pb-20 relative">
                        <div className="relative max-w-sm w-full">
                            {/* Subtle drop shadow */}
                            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black/20 rounded-lg blur-sm"></div>

                            {/* Main flyer */}
                            <div className="relative">
                                <img
                                    src="/vu-flyer.png"
                                    alt="Phoenix Comedy Underground: Best of Showcase - June 25"
                                    className="w-full h-auto object-contain rounded-lg shadow-xl"
                                />
                            </div>

                            {/* Aged tape corners */}
                            <div className="absolute -top-2 left-8 w-10 h-5 bg-yellow-200/60 rotate-12 rounded-sm shadow-md border border-yellow-300/40"></div>
                            <div className="absolute -bottom-2 right-12 w-12 h-6 bg-yellow-200/60 -rotate-6 rounded-sm shadow-md border border-yellow-300/40"></div>

                            {/* Floating ticket button - positioned at bottom right where there's space */}
                            <div className="absolute -bottom-4 -right-4">
                                <Button
                                    asChild
                                    className="bg-zinc-900 text-yellow-400 hover:bg-zinc-800 font-bold text-lg px-6 py-3 rounded-none border-4 border-zinc-900 hover:border-zinc-700 shadow-2xl transform hover:scale-105 transition-all duration-200 uppercase tracking-wide"
                                >
                                    <a href="https://www.eventbrite.com/e/phoenix-comedy-underground-best-of-phoenix-showcase-tickets-1380218563879" target="_blank" rel="noopener noreferrer">
                                        Get Tickets
                                    </a>
                                </Button>
                            </div>

                            {/* 21+ disclaimer - floating at bottom left where there's space */}
                            <div className="absolute -bottom-6 left-4">
                                <p className="text-zinc-600 text-xs font-medium uppercase tracking-wide bg-amber-50/90 px-2 py-1 rounded border border-zinc-300">
                                    21+ Event
                                </p>
                            </div>
                        </div>

                        {/* Scroll indicator - positioned at bottom of this section, always visible */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                            <div className="animate-bounce">
                                <svg className="w-6 h-6 text-zinc-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                            <p className="text-zinc-600 text-xs uppercase tracking-wide">More</p>
                        </div>
                    </div>
                </div>

                {/* Mailing list section */}
                <div className="border-t-4 border-zinc-900 bg-zinc-900 text-yellow-400 py-6">
                    <div className="px-4">
                        <div className="text-center space-y-4 max-w-md mx-auto">
                            <h3 className="text-xl font-bold uppercase tracking-wider">
                                Stay in the Loop
                            </h3>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                    {/* Honeypot */}
                                    <Input
                                        type="text"
                                        className="absolute -left-[9999px]"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        className="bg-yellow-400 text-zinc-900 placeholder:text-zinc-600 border-2 border-yellow-400 rounded-none font-medium w-full py-3 text-lg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-yellow-400 text-zinc-900 hover:bg-yellow-300 font-bold px-6 py-3 rounded-none border-2 border-yellow-400 hover:border-yellow-300 uppercase tracking-wide text-lg w-full"
                                    >
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {buttonText}
                                    </Button>
                                </form>
                            </Form>

                            {/* Contact info */}
                            <div className="flex flex-col items-center gap-3 pt-4 border-t border-yellow-400/20">
                                <a
                                    href="https://instagram.com/phoenixcomedyunderground"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                                >
                                    <Instagram className="w-5 h-5" />
                                    @phoenixcomedyunderground
                                </a>

                                <a href="mailto:contact@phoenixcomedyunderground.com" className="text-yellow-400/80 hover:text-yellow-300 underline text-sm">
                                    contact@phoenixcomedyunderground.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}