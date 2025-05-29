import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Instagram } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { subscribe } from '@/lib/actions/subscribers';
import { subscribeSchema, SubscribeInput } from '@/lib/schemas/subscribers';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export function DesktopHome() {
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
        <main className="h-screen relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 overflow-hidden flex flex-col">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Hero section */}
                <div className="flex-1 flex items-center justify-center px-4 pt-8 pb-4">
                    <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
                        {/* Flyer Side */}
                        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                            <div className="relative">
                                {/* Subtle drop shadow */}
                                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black/20 rounded-lg blur-sm"></div>

                                {/* Main flyer */}
                                <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src="/vu-flyer.png"
                                        alt="Phoenix Comedy Underground: Best of Showcase - June 25"
                                        className="max-w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-xl"
                                    />
                                </div>

                                {/* Aged tape corners */}
                                <div className="absolute -top-2 left-12 w-12 h-6 bg-yellow-200/60 rotate-12 rounded-sm shadow-md border border-yellow-300/40"></div>
                                <div className="absolute -bottom-2 right-16 w-12 h-6 bg-yellow-200/60 -rotate-6 rounded-sm shadow-md border border-yellow-300/40"></div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
                            {/* Title with vintage poster feel */}
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 leading-none tracking-tight">
                                    NEXT
                                    <br />
                                    <span className="text-4xl md:text-5xl lg:text-6xl text-zinc-700">SHOW</span>
                                </h1>

                                <div className="w-24 h-1 bg-zinc-800 mx-auto lg:mx-0"></div>

                                <p className="text-xl md:text-2xl text-zinc-700 font-medium uppercase tracking-wider">
                                    Underground Comedy
                                </p>
                            </div>

                            {/* Call to action */}
                            <div className="space-y-6">
                                <Button
                                    asChild
                                    className="bg-zinc-900 text-yellow-400 hover:bg-zinc-800 font-bold text-xl px-12 py-6 rounded-none border-4 border-zinc-900 hover:border-zinc-700 shadow-lg transform hover:scale-105 transition-all duration-200 uppercase tracking-wide"
                                >
                                    <a href="https://www.eventbrite.com/e/phoenix-comedy-underground-best-of-phoenix-showcase-tickets-1380218563879" target="_blank" rel="noopener noreferrer">
                                        Get Tickets
                                    </a>
                                </Button>

                                {/* 21+ disclaimer */}
                                <p className="text-zinc-600 text-sm font-medium uppercase tracking-wide">
                                    21+ Event
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mailing list footer */}
                <div className="border-t-4 border-zinc-900 bg-zinc-900 text-yellow-400 py-4">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center space-y-3">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
                                    <div className="flex flex-col sm:flex-row gap-3">
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
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            className="bg-yellow-400 text-zinc-900 placeholder:text-zinc-600 border-2 border-yellow-400 rounded-none font-medium"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-400 text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="bg-yellow-400 text-zinc-900 hover:bg-yellow-300 font-bold px-6 py-2 rounded-none border-2 border-yellow-400 hover:border-yellow-300 uppercase tracking-wide text-sm"
                                        >
                                            {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                            {buttonText}
                                        </Button>
                                    </div>
                                </form>
                            </Form>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs">
                                <a
                                    href="https://instagram.com/phoenixcomedyunderground"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                                >
                                    <Instagram className="w-4 h-4" />
                                    @phoenixcomedyunderground
                                </a>

                                <span className="text-yellow-400/60">•</span>

                                <a href="mailto:contact@phoenixcomedyunderground.com" className="text-yellow-400/80 hover:text-yellow-300 underline">
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