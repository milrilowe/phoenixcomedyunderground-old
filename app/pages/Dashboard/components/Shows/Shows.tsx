import { useState, useEffect } from 'react';
import { fetchAllShowsAdmin } from '@/lib/actions/shows';
import { toast } from 'sonner';
import { Loader2, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Show } from '@prisma/client';
import { ShowsList, CreateShowForm, EditShowForm } from './components';


export function Shows() {
    // State for shows
    const [shows, setShows] = useState<Show[]>([]);
    const [filteredShows, setFilteredShows] = useState<Show[]>([]);
    const [showSearch, setShowSearch] = useState('');
    const [isLoadingShows, setIsLoadingShows] = useState(true);
    const [selectedShowIds, setSelectedShowIds] = useState<number[]>([]);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [showFilter, setShowFilter] = useState<'all' | 'upcoming' | 'past' | 'featured' | 'draft'>('all');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [expandedShowId, setExpandedShowId] = useState<number | null>(null);

    // Fetch shows
    const loadShows = async () => {
        setIsLoadingShows(true);
        try {
            const data = await fetchAllShowsAdmin();
            setShows(data);
            filterShows(data, showFilter, showSearch);
        } catch (error) {
            toast.error('Failed to load shows');
            console.error(error);
        } finally {
            setIsLoadingShows(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        loadShows();
    }, []);

    // Filter shows
    const filterShows = (shows: Show[], filter: 'all' | 'upcoming' | 'past' | 'featured' | 'draft', search: string) => {
        let filtered = shows;
        const now = new Date();

        // Apply time filter
        switch (filter) {
            case 'upcoming':
                filtered = filtered.filter(show => new Date(show.date) >= now);
                break;
            case 'past':
                filtered = filtered.filter(show => new Date(show.date) < now);
                break;
            case 'featured':
                filtered = filtered.filter(show => show.featured);
                break;
            case 'draft':
                filtered = filtered.filter(show => !show.published);
                break;
        }

        // Apply search filter
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                show =>
                    show.title.toLowerCase().includes(searchLower) ||
                    (show.venue && show.venue.toLowerCase().includes(searchLower)) ||
                    (show.location && show.location.toLowerCase().includes(searchLower)) ||
                    (show.performers && show.performers.toLowerCase().includes(searchLower))
            );
        }

        // Sort by date (upcoming first for all/featured/draft, past first for past)
        filtered = [...filtered].sort((a, b) => {
            return filter === 'past'
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setFilteredShows(filtered);
    };

    // Update filtered shows when search or filter changes
    useEffect(() => {
        filterShows(shows, showFilter, showSearch);
    }, [showSearch, showFilter, shows]);

    // Handle show selection
    const toggleShowSelection = (id: number, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        setSelectedShowIds(prev =>
            prev.includes(id)
                ? prev.filter(showId => showId !== id)
                : [...prev, id]
        );
    };

    // Select all visible shows
    const toggleSelectAll = () => {
        if (selectedShowIds.length === filteredShows.length) {
            setSelectedShowIds([]);
        } else {
            setSelectedShowIds(filteredShows.map(show => show.id));
        }
    };

    // Toggle expanded show details
    const toggleExpandShow = (id: number) => {
        setExpandedShowId(expandedShowId === id ? null : id);
    };

    // Start editing a show
    const handleEdit = (show: Show) => {
        setSelectedShow(show);
        setIsEditing(true);
        setIsCreating(false);
    };

    // Start creating a show
    const handleCreate = () => {
        setIsCreating(true);
        setIsEditing(false);
        setSelectedShow(null);
    };

    // After successfully creating a show
    const handleShowCreated = (show: Show) => {
        setShows(prevShows => [...prevShows, show]);
        setIsCreating(false);
        toast.success('Show created successfully');
    };

    // After successfully updating a show
    const handleShowUpdated = (show: Show) => {
        setShows(prevShows =>
            prevShows.map(s => s.id === show.id ? show : s)
        );
        setIsEditing(false);
        toast.success('Show updated successfully');
    };

    // If creating or editing, show the appropriate form
    if (isCreating) {
        return (
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-zinc-100 font-semibold">Create New Show</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreating(false)}
                        className="border-zinc-700 text-zinc-400"
                    >
                        Cancel
                    </Button>
                </div>
                <CreateShowForm onSuccess={handleShowCreated} onCancel={() => setIsCreating(false)} />
            </div>
        );
    }

    if (isEditing && selectedShow) {
        return (
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-zinc-100 font-semibold">Edit Show: {selectedShow.title}</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="border-zinc-700 text-zinc-400"
                    >
                        Cancel
                    </Button>
                </div>
                <EditShowForm
                    show={selectedShow}
                    onSuccess={handleShowUpdated}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-white">Show Management</h2>
                    <span className="ml-2 text-sm text-zinc-400">
                        {filteredShows.length} show{filteredShows.length !== 1 && 's'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="default"
                        className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
                        onClick={handleCreate}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Show
                    </Button>
                </div>
            </div>

            {/* Search & Filters */}
            {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative md:col-span-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search shows by title, venue, or performers..."
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-10"
                        value={showSearch}
                        onChange={(e) => setShowSearch(e.target.value)}
                    />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-2">
                    <FilterButton
                        active={showFilter === 'all'}
                        onClick={() => setShowFilter('all')}
                        label="All"
                    />
                    <FilterButton
                        active={showFilter === 'upcoming'}
                        onClick={() => setShowFilter('upcoming')}
                        label="Upcoming"
                    />
                    <FilterButton
                        active={showFilter === 'past'}
                        onClick={() => setShowFilter('past')}
                        label="Past"
                    />
                    <FilterButton
                        active={showFilter === 'featured'}
                        onClick={() => setShowFilter('featured')}
                        label="Featured"
                    />
                    <FilterButton
                        active={showFilter === 'draft'}
                        onClick={() => setShowFilter('draft')}
                        label="Drafts"
                    />
                </div>
            </div> */}

            {/* Selected Shows Actions */}
            {/* {selectedShowIds.length > 0 && (
                <SelectedShowsActions
                    selectedShowIds={selectedShowIds}
                    setSelectedShowIds={setSelectedShowIds}
                    shows={shows}
                    setShows={setShows}
                    expandedShowId={expandedShowId}
                    setExpandedShowId={setExpandedShowId}
                    selectedShow={selectedShow}
                    setSelectedShow={setSelectedShow}
                />
            )} */}

            {/* Shows List */}
            {isLoadingShows ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                </div>
            ) : filteredShows.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                    <h3 className="text-xl font-medium text-zinc-200 mb-2">No shows found</h3>
                    <p className="text-zinc-400 max-w-md mx-auto mb-6">
                        {showSearch
                            ? "No shows match your search criteria. Try adjusting your search or filters."
                            : "You haven't created any shows yet. Create your first show to get started."}
                    </p>
                    {!showSearch && (
                        <Button
                            onClick={handleCreate}
                            className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Show
                        </Button>
                    )}
                </div>
            ) : (
                <ShowsList
                    filteredShows={filteredShows}
                    selectedShowIds={selectedShowIds}
                    toggleSelectAll={toggleSelectAll}
                    toggleShowSelection={toggleShowSelection}
                    expandedShowId={expandedShowId}
                    toggleExpandShow={toggleExpandShow}
                    onEdit={handleEdit}
                    shows={shows}
                    setShows={setShows}
                />
            )}
        </div>
    );
}