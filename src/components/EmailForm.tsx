// src/components/EmailForm.jsx
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

export function EmailForm({ className = "" }) {
    const [isPending, startTransition] = React.useTransition();
    const [buttonText, setButtonText] = React.useState('Join');

    const form = useForm({
        resolver: zodResolver(subscribeSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = React.useCallback(async (data) => {
        startTransition(async () => {
            try {
                const result = await subscribe({ data });

                if (result.alreadySubscribed) {
                    setButtonText('Already subscribed!');
                } else {
                    setButtonText('Welcome!');
                    form.reset();
                }

                setTimeout(() => setButtonText('Join'), 3000);
            } catch (error) {
                console.error('Submit error:', error);
                setButtonText('Try again');
                setTimeout(() => setButtonText('Join'), 3000);
            }
        });
    }, [form]);

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
    );
}