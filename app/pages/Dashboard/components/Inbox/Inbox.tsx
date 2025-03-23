import { useState, useEffect } from 'react';
import { getMessages, markMessageAsRead, deleteMessage } from '@/lib/actions/messages';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Loader2, Search, Inbox as InboxIcon, Clipboard, RefreshCw,
    ArrowLeft, Reply, Mail, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { Message } from '@/lib/types/messages';
import { Checkbox } from '@/components/ui/checkbox';

export function Inbox() {
    // State for messages
    const [messages, setMessages] = useState<Message[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const [messageSearch, setMessageSearch] = useState('');
    const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([]);

    // Fetch messages
    const loadMessages = async () => {
        setIsLoadingMessages(true);
        try {
            const { messages: data } = await getMessages();
            setMessages(data);
            filterMessages(data, messageFilter, messageSearch);
        } catch (error) {
            toast.error('Failed to load messages');
            console.error(error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        loadMessages();
    }, []);

    // Filter messages
    const filterMessages = (messages: Message[], filter: 'all' | 'unread' | 'read', search: string) => {
        let filtered = messages;

        // Apply read/unread filter
        if (filter === 'unread') {
            filtered = filtered.filter(message => !message.read);
        } else if (filter === 'read') {
            filtered = filtered.filter(message => message.read);
        }

        // Apply search filter
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                message =>
                    message.subject.toLowerCase().includes(searchLower) ||
                    message.email.toLowerCase().includes(searchLower) ||
                    message.message.toLowerCase().includes(searchLower)
            );
        }

        setFilteredMessages(filtered);
    };

    // Update filtered messages when search or filter changes
    useEffect(() => {
        filterMessages(messages, messageFilter, messageSearch);
    }, [messageSearch, messageFilter, messages]);

    // Handle marking a message as read
    const handleMarkAsRead = async (id: number) => {
        try {
            await markMessageAsRead({ data: id });
            setMessages(prevMessages =>
                prevMessages.map(message =>
                    message.id === id ? { ...message, read: true } : message
                )
            );
            toast.success('Message marked as read');
        } catch (error) {
            toast.error('Failed to mark message as read');
            console.error(error);
        }
    };

    // Handle marking selected messages as read
    const handleMarkSelectedAsRead = async () => {
        if (selectedMessageIds.length === 0) return;

        try {
            for (const id of selectedMessageIds) {
                await markMessageAsRead({ data: id });
            }

            setMessages(prevMessages =>
                prevMessages.map(message =>
                    selectedMessageIds.includes(message.id) ? { ...message, read: true } : message
                )
            );

            toast.success(`${selectedMessageIds.length} message(s) marked as read`);
            setSelectedMessageIds([]);
        } catch (error) {
            toast.error('Failed to mark messages as read');
            console.error(error);
        }
    };

    // Handle deleting selected messages
    const handleDeleteSelected = async () => {
        if (selectedMessageIds.length === 0) return;

        if (confirm(`Are you sure you want to delete ${selectedMessageIds.length} message(s)?`)) {
            try {
                for (const id of selectedMessageIds) {
                    await deleteMessage({ data: id });
                }

                // If the currently viewed message is being deleted, clear it
                if (selectedMessage && selectedMessageIds.includes(selectedMessage.id)) {
                    setSelectedMessage(null);
                }

                setMessages(prevMessages =>
                    prevMessages.filter(message => !selectedMessageIds.includes(message.id))
                );

                toast.success(`${selectedMessageIds.length} message(s) deleted`);
                setSelectedMessageIds([]);
            } catch (error) {
                toast.error('Failed to delete messages');
                console.error(error);
            }
        }
    };

    // Handle deleting a message
    const handleDeleteMessage = async (id: number) => {
        try {
            await deleteMessage({ data: id });

            // If the currently viewed message is being deleted, clear it
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage(null);
            }

            setMessages(prevMessages =>
                prevMessages.filter(message => message.id !== id)
            );
            toast.success('Message deleted successfully');
        } catch (error) {
            toast.error('Failed to delete message');
            console.error(error);
        }
    };

    // View message details
    const viewMessage = (message: Message) => {
        setSelectedMessage(message);

        // If message is unread, mark it as read
        if (!message.read) {
            handleMarkAsRead(message.id);
        }
    };

    // Copy content to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    // Handle message selection
    const toggleMessageSelection = (id: number, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        setSelectedMessageIds(prev =>
            prev.includes(id)
                ? prev.filter(messageId => messageId !== id)
                : [...prev, id]
        );
    };

    // Select all visible messages
    const selectAllMessages = () => {
        if (selectedMessageIds.length === filteredMessages.length) {
            setSelectedMessageIds([]);
        } else {
            setSelectedMessageIds(filteredMessages.map(message => message.id));
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
            {/* Search and filter bar */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search messages..."
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-10"
                        value={messageSearch}
                        onChange={(e) => setMessageSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={messageFilter === 'all' ? 'default' : 'outline'}
                        className={messageFilter === 'all' ? 'bg-yellow-500 text-zinc-950' : 'border-zinc-700 text-zinc-400'}
                        onClick={() => setMessageFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={messageFilter === 'unread' ? 'default' : 'outline'}
                        className={messageFilter === 'unread' ? 'bg-yellow-500 text-zinc-950' : 'border-zinc-700 text-zinc-400'}
                        onClick={() => setMessageFilter('unread')}
                    >
                        Unread
                    </Button>
                    <Button
                        variant={messageFilter === 'read' ? 'default' : 'outline'}
                        className={messageFilter === 'read' ? 'bg-yellow-500 text-zinc-950' : 'border-zinc-700 text-zinc-400'}
                        onClick={() => setMessageFilter('read')}
                    >
                        Read
                    </Button>
                    <Button
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 ml-auto"
                        onClick={loadMessages}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Gmail-style mail container with fixed height */}
            <div className="bg-zinc-900 rounded-md border border-zinc-800 shadow-lg overflow-hidden flex flex-col h-[600px]">
                {/* Gmail-style toolbar */}
                <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm sticky top-0 z-10">
                    <Checkbox
                        checked={filteredMessages.length > 0 && selectedMessageIds.length === filteredMessages.length}
                        onClick={selectAllMessages}
                        className="border-zinc-600 mr-2"
                    />

                    {selectedMessageIds.length > 0 ? (
                        <div className="flex gap-2 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-400 hover:text-zinc-100"
                                onClick={handleMarkSelectedAsRead}
                            >
                                <Mail className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Mark as Read</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-400 hover:text-zinc-100"
                                onClick={handleDeleteSelected}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-sm text-zinc-400 ml-2">
                            {filteredMessages.length} message{filteredMessages.length !== 1 && 's'}
                        </div>
                    )}
                </div>

                {/* Two-panel email layout (Gmail style) */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Messages list panel */}
                    <div className={`${selectedMessage ? 'hidden md:block md:w-2/5 lg:w-1/3' : 'w-full'} overflow-y-auto border-r border-zinc-800`}>
                        {isLoadingMessages ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">
                                <InboxIcon className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                <p>No messages found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {filteredMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-start py-3 px-4 hover:bg-zinc-800/50 transition-colors cursor-pointer
                                            ${message.id === selectedMessage?.id ? 'bg-zinc-800' : ''}
                                            ${selectedMessageIds.includes(message.id) ? 'bg-zinc-800/70' : ''}
                                            ${!message.read ? 'bg-zinc-800/30' : ''}`}
                                        onClick={() => viewMessage(message)}
                                    >
                                        <div className="flex items-center mr-3" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedMessageIds.includes(message.id)}
                                                onClick={(e) => toggleMessageSelection(message.id, e as any)}
                                                className="border-zinc-600"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className={`text-base truncate ${!message.read ? 'font-bold text-white' : 'text-zinc-300'}`}>
                                                    {message.email}
                                                </div>
                                                <div className="text-xs text-zinc-400 whitespace-nowrap ml-4 flex items-center">
                                                    {!message.read && (
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                                    )}
                                                    {getRelativeTime(message.createdAt)}
                                                </div>
                                            </div>

                                            <div className={`text-sm truncate ${!message.read ? 'font-medium text-zinc-100' : 'text-zinc-300'}`}>
                                                {message.subject}
                                            </div>

                                            <div className="text-xs text-zinc-400 truncate">
                                                {message.message.substring(0, 100)}
                                                {message.message.length > 100 && '...'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message reading panel */}
                    {selectedMessage && (
                        <div className={`${selectedMessage ? 'w-full md:w-3/5 lg:w-2/3' : 'hidden'} overflow-y-auto`}>
                            {/* Message header */}
                            <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mr-2 md:hidden text-zinc-400 hover:text-zinc-100"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <h2 className="text-xl font-semibold text-zinc-100">{selectedMessage.subject}</h2>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                                            onClick={() => copyToClipboard(selectedMessage.message)}
                                        >
                                            <Clipboard className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-red-400"
                                            onClick={() => handleDeleteMessage(selectedMessage.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center mb-2">
                                    <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-semibold">
                                        {selectedMessage.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-zinc-100 font-medium">
                                            {selectedMessage.email}
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            to me
                                        </div>
                                    </div>
                                    <div className="ml-auto text-sm text-zinc-400">
                                        {format(new Date(selectedMessage.createdAt), 'MMM d, yyyy h:mm a')}
                                    </div>
                                </div>

                                <div className="flex space-x-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 text-zinc-300 hover:text-zinc-100"
                                    >
                                        <Reply className="h-4 w-4 mr-1" />
                                        Reply
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 text-zinc-300 hover:text-zinc-100"
                                        onClick={() => copyToClipboard(selectedMessage.email)}
                                    >
                                        <Mail className="h-4 w-4 mr-1" />
                                        Copy Email
                                    </Button>
                                </div>
                            </div>

                            {/* Message body */}
                            <div className="p-6 text-zinc-100 whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}