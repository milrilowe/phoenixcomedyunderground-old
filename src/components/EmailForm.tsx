// src/components/EmailForm.tsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { subscribe } from '@/lib/actions/subscribers';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';

const subscribeSchema = z.object({
    email: z.string().email('Please provide a valid email address')
});

// Declare gtag function for TypeScript
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export function EmailForm({ className = "" }) {
    const [isPending, startTransition] = React.useTransition();
    const [buttonText, setButtonText] = React.useState('Join');

    const form = useForm({
        resolver: zodResolver(subscribeSchema),
        defaultValues: {
            email: '',
        }
    });

    const source = typeof window !== 'undefined'
        ? localStorage.getItem('qrSource') || 'direct'
        : 'direct';

    const onSubmit = React.useCallback(async (data: { email: string }) => {

        startTransition(async () => {
            try {
                const result = await subscribe({ data: { ...data, source } });

                // Track email signup event
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'sign_up', {
                        method: 'email',
                        event_category: 'engagement',
                        event_label: `email_signup_${source}`,
                        value: 1
                    });
                }

                if (result.alreadySubscribed) {
                    setButtonText('Already subscribed!');
                } else {
                    setButtonText('Welcome!');
                    form.reset();
                }

                setTimeout(() => setButtonText('Join'), 3000);
            } catch (error) {
                console.error('Submit error:', error);

                // Track form submission error
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'form_submit_error', {
                        event_category: 'engagement',
                        event_label: 'email_signup_error',
                        value: 0
                    });
                }

                setButtonText('Try again');
                setTimeout(() => setButtonText('Join'), 3000);
            }
        });
    }, [form]);

    // Track form interaction
    const handleFormFocus = React.useCallback(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'form_start', {
                event_category: 'engagement',
                event_label: 'email_signup_start',
                value: 1
            });
        }
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
                <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="bg-white text-black placeholder:text-stone-600 border-2 border-white rounded-none font-medium focus:border-red-300 focus:ring-0"
                                        onFocus={handleFormFocus}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-300 text-xs" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-white text-red-700 hover:bg-red-50 font-bold px-6 py-2 rounded-none border-2 border-white hover:border-red-50 uppercase tracking-wide text-sm"
                    >
                        {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        {buttonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
}