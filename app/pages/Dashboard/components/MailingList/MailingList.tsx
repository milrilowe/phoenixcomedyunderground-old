import { useState, useEffect } from 'react';
import { fetchSubscribers, deleteSubscriber } from '@/lib/actions/subscribers';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Loader2, Search, Mail, RefreshCw, ArrowLeft,
    UserMinus, Copy, Calendar, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { Subscriber } from '@/lib/types/subscribers';
import { Checkbox } from '@/components/ui/checkbox';

export function MailingList() {
    // State for subscribers
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
    const [subscriberSearch, setSubscriberSearch] = useState('');
    const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
    const [selectedSubscriberIds, setSelectedSubscriberIds] = useState<number[]>([]);
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

    // Fetch subscribers
    const loadSubscribers = async () => {
        setIsLoadingSubscribers(true);
        try {
            const data = await fetchSubscribers();
            setSubscribers(data);
            setFilteredSubscribers(data);
        } catch (error) {
            toast.error('Failed to load subscribers');
            console.error(error);
        } finally {
            setIsLoadingSubscribers(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        loadSubscribers();
    }, []);

    // Filter subscribers when search changes
    useEffect(() => {
        if (!subscriberSearch.trim()) {
            setFilteredSubscribers(subscribers);
            return;
        }

        const filtered = subscribers.filter(subscriber =>
            subscriber.email.toLowerCase().includes(subscriberSearch.toLowerCase())
        );
        setFilteredSubscribers(filtered);
    }, [subscriberSearch, subscribers]);

    // Handle deleting a subscriber
    const handleDeleteSubscriber = async (id: number) => {
        try {
            await deleteSubscriber({ data: id });

            // If the currently viewed subscriber is being deleted, clear it
            if (selectedSubscriber && selectedSubscriber.id === id) {
                setSelectedSubscriber(null);
            }

            setSubscribers(prevSubscribers =>
                prevSubscribers.filter(subscriber => subscriber.id !== id)
            );

            toast.success('Subscriber deleted successfully');
        } catch (error) {
            toast.error('Failed to delete subscriber');
            console.error(error);
        }
    };

    // Handle deleting selected subscribers
    const handleDeleteSelectedSubscribers = async () => {
        if (selectedSubscriberIds.length === 0) return;

        if (confirm(`Are you sure you want to delete ${selectedSubscriberIds.length} subscriber(s)?`)) {
            try {
                for (const id of selectedSubscriberIds) {
                    await deleteSubscriber({ data: id });
                }

                // If the currently viewed subscriber is being deleted, clear it
                if (selectedSubscriber && selectedSubscriberIds.includes(selectedSubscriber.id)) {
                    setSelectedSubscriber(null);
                }

                setSubscribers(prevSubscribers =>
                    prevSubscribers.filter(subscriber => !selectedSubscriberIds.includes(subscriber.id))
                );

                toast.success(`${selectedSubscriberIds.length} subscriber(s) deleted`);
                setSelectedSubscriberIds([]);
            } catch (error) {
                toast.error('Failed to delete subscribers');
                console.error(error);
            }
        }
    };

    // View subscriber details
    const viewSubscriber = (subscriber: Subscriber) => {
        setSelectedSubscriber(subscriber);
    };

    // Copy content to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    // Handle subscriber selection
    const toggleSubscriberSelection = (id: number, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        setSelectedSubscriberIds(prev =>
            prev.includes(id)
                ? prev.filter(subscriberId => subscriberId !== id)
                : [...prev, id]
        );
    };

    // Select all visible subscribers
    const selectAllSubscribers = () => {
        if (selectedSubscriberIds.length === filteredSubscribers.length) {
            setSelectedSubscriberIds([]);
        } else {
            setSelectedSubscriberIds(filteredSubscribers.map(subscriber => subscriber.id));
        }
    };

    // Format time relative to now
    const getRelativeTime = (date: Date | string) => {
        const messageDate = typeof date === 'string' ? new Date(date) : date;

        // If it's today, show time
        if (messageDate.toDateString() === new Date().toDateString()) {
            return format(messageDate, 'h:mm a');
        }

        // If it's within the last 7 days, show day name
        const daysDiff = Math.floor((new Date().getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
            return format(messageDate, 'EEE');
        }

        // Otherwise, show month and day
        return format(messageDate, 'MMM d');
    };

    return (
        <>
            {/* Search bar */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search subscribers..."
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-10"
                        value={subscriberSearch}
                        onChange={(e) => setSubscriberSearch(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-400 ml-auto"
                    onClick={loadSubscribers}
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Subscribers container with fixed height */}
            <div className="bg-zinc-900 rounded-md border border-zinc-800 shadow-lg overflow-hidden flex flex-col h-[600px]">
                {/* Toolbar */}
                <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm sticky top-0 z-10">
                    <Checkbox
                        checked={filteredSubscribers.length > 0 && selectedSubscriberIds.length === filteredSubscribers.length}
                        onClick={selectAllSubscribers}
                        className="border-zinc-600 mr-2"
                    />

                    {selectedSubscriberIds.length > 0 ? (
                        <div className="flex gap-2 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-400 hover:text-red-400"
                                onClick={handleDeleteSelectedSubscribers}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-sm text-zinc-400 ml-2">
                            {filteredSubscribers.length} subscriber{filteredSubscribers.length !== 1 && 's'}
                        </div>
                    )}
                </div>

                {/* Two-panel layout */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Subscribers list panel */}
                    <div className={`${selectedSubscriber ? 'hidden md:block md:w-2/5 lg:w-1/3' : 'w-full'} overflow-y-auto border-r border-zinc-800`}>
                        {isLoadingSubscribers ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            </div>
                        ) : filteredSubscribers.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">
                                <Mail className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                <p>No subscribers found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {filteredSubscribers.map((subscriber) => (
                                    <div
                                        key={subscriber.id}
                                        className={`flex items-center py-3 px-4 hover:bg-zinc-800/50 transition-colors cursor-pointer
                                            ${subscriber.id === selectedSubscriber?.id ? 'bg-zinc-800' : ''}
                                            ${selectedSubscriberIds.includes(subscriber.id) ? 'bg-zinc-800/70' : ''}`}
                                        onClick={() => viewSubscriber(subscriber)}
                                    >
                                        <div className="flex items-center mr-3" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedSubscriberIds.includes(subscriber.id)}
                                                onClick={(e) => toggleSubscriberSelection(subscriber.id, e as any)}
                                                className="border-zinc-600"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="text-base truncate text-zinc-300">
                                                    {subscriber.email}
                                                </div>
                                                <div className="text-xs text-zinc-400 whitespace-nowrap ml-4">
                                                    {getRelativeTime(subscriber.createdAt)}
                                                </div>
                                            </div>
                                            <div className="text-xs text-zinc-500">
                                                Joined {format(new Date(subscriber.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Subscriber details panel */}
                    {selectedSubscriber && (
                        <div className={`${selectedSubscriber ? 'w-full md:w-3/5 lg:w-2/3' : 'hidden'} overflow-y-auto`}>
                            {/* Subscriber header */}
                            <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mr-2 md:hidden text-zinc-400 hover:text-zinc-100"
                                            onClick={() => setSelectedSubscriber(null)}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <h2 className="text-xl font-semibold text-zinc-100">Subscriber Details</h2>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                                            onClick={() => copyToClipboard(selectedSubscriber.email)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-red-400"
                                            onClick={() => handleDeleteSubscriber(selectedSubscriber.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-semibold text-lg">
                                        {selectedSubscriber.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-zinc-100 font-medium">
                                            {selectedSubscriber.email}
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            Mailing List Subscriber
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 text-zinc-300 hover:text-zinc-100"
                                        onClick={() => copyToClipboard(selectedSubscriber.email)}
                                    >
                                        <Mail className="h-4 w-4 mr-1" />
                                        Copy Email
                                    </Button>
                                </div>
                            </div>

                            {/* Subscriber details content */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">Email Address</h3>
                                        <p className="text-zinc-100">{selectedSubscriber.email}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">Joined On</h3>
                                        <p className="text-zinc-100">{format(new Date(selectedSubscriber.createdAt), 'MMMM d, yyyy')}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">Subscription Duration</h3>
                                        <p className="text-zinc-100">
                                            {Math.floor((new Date().getTime() - new Date(selectedSubscriber.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-800">
                                        <h3 className="text-zinc-200 font-medium text-lg mb-4">Actions</h3>

                                        <div className="space-y-3">
                                            <Button
                                                variant="outline"
                                                className="w-full border-zinc-700 text-zinc-300 hover:text-zinc-100 justify-start"
                                            >
                                                <Mail className="h-4 w-4 mr-2" />
                                                Send Email Campaign
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full border-zinc-700 text-zinc-300 hover:text-zinc-100 justify-start"
                                            >
                                                <Calendar className="h-4 w-4 mr-2" />
                                                View Subscription History
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full border-zinc-700 text-red-400 hover:text-red-300 hover:border-red-700 justify-start"
                                                onClick={() => handleDeleteSubscriber(selectedSubscriber.id)}
                                            >
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Delete Subscriber
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}