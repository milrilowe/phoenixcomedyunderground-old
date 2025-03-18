import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { subscribe } from '@/lib/actions/subscribers';
import { subscribeSchema, SubscribeInput } from '@/lib/schemas/subscribers';

export function MailingListDialog() {
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);
    const [isPending, startTransition] = React.useTransition();

    // Set up react-hook-form with zod validation
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
                    toast.info('You are already subscribed to our mailing list!');
                } else {
                    toast.success('Successfully subscribed to our mailing list!');
                }

                // Reset form
                form.reset();
                // Close dialog
                closeButtonRef.current?.click();
            } catch (error) {
                toast.error(`Subscription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="border-zinc-800 bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors w-full sm:w-auto"
                >
                    Join Mailing List
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 
                   [&>button]:text-zinc-400"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-50">
                        Stay Updated
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Subscribe to get notified about new shows and special events.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Honeypot field */}
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
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            autoFocus={false}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-50 
                                                placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-yellow-500 text-zinc-950 
                                    hover:bg-yellow-400 transition-colors 
                                    disabled:bg-yellow-500/70"
                            >
                                {isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Subscribe
                            </Button>
                        </div>
                    </form>
                </Form>

                <DialogClose ref={closeButtonRef} className="hidden" />
            </DialogContent>
        </Dialog>
    );
}