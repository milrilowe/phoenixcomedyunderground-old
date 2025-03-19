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
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2, Mail, MessageSquare, User } from 'lucide-react';
import { messageSchema, type MessageInput } from '@/lib/schemas/messages';
import { sendMessage } from '@/lib/actions/messages';

export function MessageForm() {
    const [isPending, startTransition] = React.useTransition();

    // Initialize form with react-hook-form and zod validation
    const form = useForm<MessageInput>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    });

    // Handle form submission
    function onSubmit(data: MessageInput) {
        startTransition(async () => {
            try {
                const result = await sendMessage({ data });

                if (result.success) {
                    toast.success('Message sent successfully! We\'ll be in touch soon.');
                    form.reset(); // Reset form after successful submission
                } else {
                    toast.error(`Failed to send message: ${result.message}`);
                }
            } catch (error) {
                toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 md:p-6">
                <h2 className="text-xl font-bold text-zinc-50 mb-4">Contact Us</h2>
                <p className="text-zinc-400 mb-6">
                    Have questions about our shows, venue, or want to book a private event?
                    We'd love to hear from you.
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

                        {/* Name field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-50">Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                {...field}
                                                placeholder="Your name"
                                                className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 pl-10"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') e.preventDefault();
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-50">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="your@email.com"
                                                className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 pl-10"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') e.preventDefault();
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Message field */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-50">Message</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <textarea
                                                {...field}
                                                placeholder="Your message"
                                                className="w-full h-32 md:h-48 rounded-md bg-zinc-800 border border-zinc-700 
                                                    text-zinc-50 placeholder:text-zinc-500 p-3 pl-10 focus:outline-none focus:ring-2 
                                                    focus:ring-yellow-500 focus:border-transparent resize-none"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit button */}
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 
                                transition-colors disabled:bg-yellow-500/70"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Message
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}