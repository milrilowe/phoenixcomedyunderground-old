import { useState, useEffect } from 'react';
import { Inbox, MailingList, Shows } from './components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Inbox as InboxIcon, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getMessages } from '@/lib/actions/messages';
import { fetchSubscribers } from '@/lib/actions/subscribers';
import { fetchAllShowsAdmin } from '@/lib/actions/shows';

export function Dashboard() {
    // State for summary counts
    const [unreadCount, setUnreadCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [showCount, setShowCount] = useState(0);

    // Fetch summary data for badges
    const loadSummaryData = async () => {
        try {
            // Get message counts for badge
            const { messages } = await getMessages();
            setUnreadCount(messages.filter(m => !m.read).length);

            // Get subscriber count for badge
            const subscribers = await fetchSubscribers();
            setSubscriberCount(subscribers.length);

            // Get show count for badge
            const shows = await fetchAllShowsAdmin();
            setShowCount(shows.length);
        } catch (error) {
            console.error('Error loading summary data:', error);
        }
    };

    // Initial data fetch for badges
    useEffect(() => {
        loadSummaryData();
    }, []);

    return (
        <div className="p-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>

            {/* Tab Navigation */}
            <Tabs defaultValue="shows" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="shows" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Shows</span>
                        <Badge className="ml-1 bg-yellow-500 text-black">
                            {showCount}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                        <InboxIcon className="h-4 w-4" />
                        <span>Messages</span>
                        {unreadCount > 0 && (
                            <Badge className="ml-1 bg-yellow-500 text-black">
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="subscribers" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Subscribers</span>
                        <Badge className="ml-1 bg-zinc-700 text-zinc-300">
                            {subscriberCount}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                {/* Shows Tab */}
                <TabsContent value="shows" className="mt-0 p-0 h-auto">
                    <Shows />
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages" className="mt-0 p-0 h-auto">
                    <Inbox />
                </TabsContent>

                {/* Subscribers Tab */}
                <TabsContent value="subscribers" className="mt-0 p-0 h-auto">
                    <MailingList />
                </TabsContent>
            </Tabs>
        </div>
    );
}