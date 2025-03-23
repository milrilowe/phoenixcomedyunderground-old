// app/pages/Dashboard/components/Shows/EditShowForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateShow } from '@/lib/actions/shows';
import { showUpdateSchema, type ShowUpdate } from '@/lib/schemas/shows';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Show } from '@prisma/client';
import { format } from 'date-fns';

interface EditShowFormProps {
    show: Show;
    onSuccess: (show: Show) => void;
    onCancel: () => void;
}

export function EditShowForm({ show, onSuccess, onCancel }: EditShowFormProps) {
    const [isPending, startTransition] = useState(false);

    // Format dates for form inputs
    const formatDateForInput = (date: Date | string): string => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return format(dateObj, "yyyy-MM-dd");
    };

    const formatDateTimeForInput = (date: Date | string): string => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return format(dateObj, "yyyy-MM-dd'T'HH:mm");
    };

    const form = useForm<ShowUpdate>({
        resolver: zodResolver(showUpdateSchema),
        defaultValues: {
            id: show.id,
            title: show.title,
            date: formatDateForInput(show.date),
            time: formatDateTimeForInput(show.time),
            endTime: show.endTime ? formatDateTimeForInput(show.endTime) : undefined,
            description: show.description,
            location: show.location || '',
            venue: show.venue || '',
            price: show.price ? parseFloat(show.price.toString()) : 0,
            ticketUrl: show.ticketUrl || '',
            performers: show.performers || '',
            status: show.status as 'scheduled' | 'cancelled' | 'soldout',
            featured: show.featured,
            published: show.published,
            maxCapacity: show.maxCapacity || undefined,
            soldTickets: show.soldTickets || 0,
            image: show.image || '',
        }
    });

    function onSubmit(data: ShowUpdate) {
        startTransition(async () => {
            try {
                const result = await updateShow({ data });

                if (!result.success) {
                    toast.error(`Failed to update show: ${result.message}`);
                    return;
                }

                // Call the success callback with the updated show
                onSuccess(result.show);
            } catch (error) {
                toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Show Title</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Comedy Night with..."
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Venue Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Comedy Club"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ticket Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...field}
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="maxCapacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Capacity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        {...field}
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="soldTickets"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sold Tickets</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full h-9 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2"
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="soldout">Sold Out</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location Address</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="123 Main St, Phoenix, AZ"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ticketUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket URL</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://tickets.example.com/show-123"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="performers"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Performers</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="John Doe, Jane Smith"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={5}
                                    placeholder="Enter show description..."
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[100px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://example.com/show-image.jpg"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                />
                            </FormControl>
                            <FormDescription className="text-zinc-500">
                                URL to the show's promotional image
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center space-x-4">
                    <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-zinc-700"
                                    />
                                </FormControl>
                                <FormLabel className="m-0 text-zinc-300">Featured Show</FormLabel>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-zinc-700"
                                    />
                                </FormControl>
                                <FormLabel className="m-0 text-zinc-300">Published</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="border-zinc-700 text-zinc-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Show
                    </Button>
                </div>
            </form>
        </Form>
    );
}