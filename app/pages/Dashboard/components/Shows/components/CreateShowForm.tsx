// app/pages/Dashboard/components/Shows/CreateShowForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShow } from '@/lib/actions/shows';
import { showCreateSchema, type ShowCreate } from '@/lib/schemas/shows';
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

interface CreateShowFormProps {
    onSuccess: (show: Show) => void;
    onCancel: () => void;
}

export function CreateShowForm({ onSuccess, onCancel }: CreateShowFormProps) {
    const [isPending, startTransition] = useState(false);

    // Get today's date and time strings for defaults
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // Set default time to 8:00 PM
    const timeDate = new Date(today.setHours(20, 0, 0, 0));
    const timeString = timeDate.toISOString().slice(0, 16);

    // Set default end time to 10:00 PM
    const endTimeDate = new Date(today.setHours(22, 0, 0, 0));
    const endTimeString = endTimeDate.toISOString().slice(0, 16);

    const form = useForm<ShowCreate>({
        resolver: zodResolver(showCreateSchema),
        defaultValues: {
            title: '',
            date: dateString,
            time: timeString,
            endTime: endTimeString,
            description: '',
            location: '',
            venue: '',
            price: 0,
            ticketUrl: '',
            performers: '',
            status: 'scheduled',
            featured: false,
            published: true,
        }
    });

    function onSubmit(data: ShowCreate) {
        startTransition(async () => {
            try {
                const result = await createShow({ data });

                if (!result.success) {
                    toast.error(`Failed to create show: ${result.message}`);
                    return;
                }

                // Call the success callback with the created show
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
                                <FormLabel className="m-0 text-zinc-300">Publish Immediately</FormLabel>
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
                        Create Show
                    </Button>
                </div>
            </form>
        </Form>
    );
}