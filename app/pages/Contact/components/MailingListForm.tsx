import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Loader2, Mail } from 'lucide-react';
import { subscribe } from '@/lib/actions/subscribers';
import { subscribeSchema, type SubscribeInput } from '@/lib/schemas/subscribers';

export function MailingListForm() {
    const [isPending, startTransition] = React.useTransition();

    // Initialize form with react-hook-form and zod validation
    const form = useForm<SubscribeInput>({
        resolver: zodResolver(subscribeSchema),
        defaultValues: {
            email: '',
        }
    });

    // Handle form submission
    function onSubmit(data: SubscribeInput) {
        startTransition(async () => {
            try {
                const result = await subscribe({ data });

                if (result.success) {
                    if (result.alreadySubscribed) {
                        toast.info('You are already subscribed to our mailing list!');
                    } else {
                        toast.success('Successfully subscribed to our mailing list!');
                    }
                    form.reset(); // Reset form after successful submission
                } else {
                    toast.error(`Failed to subscribe: ${result.message}`);
                }
            } catch (error) {
                toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 md:p-6">
                <h2 className="text-xl font-bold text-zinc-50 mb-4">Join Our Mailing List</h2>
                <p className="text-zinc-400 mb-6">
                    Stay up-to-date with upcoming shows, special events, and exclusive offers.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Honeypot field to help with spam prevention */}
                        <Input
                            type="text"
                            className="absolute -left-[9999px]"
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    autoFocus={false}
                                                    className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 pl-10"
                                                />
                                            </FormControl>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="bg-yellow-500 text-zinc-950 
                                                hover:bg-yellow-400 transition-colors 
                                                disabled:bg-yellow-500/70"
                                        >
                                            {isPending && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Subscribe
                                        </Button>
                                    </div>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <div className="text-xs text-zinc-500 mt-4">
                            We respect your privacy and will never share your information. Unsubscribe anytime.
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}