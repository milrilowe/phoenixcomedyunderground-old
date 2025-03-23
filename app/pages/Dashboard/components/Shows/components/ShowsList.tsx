// app/pages/Dashboard/components/Shows/ShowsList.tsx
import { Show } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
import { ShowCard } from './ShowCard';

interface ShowsListProps {
    filteredShows: Show[];
    selectedShowIds: number[];
    toggleSelectAll: () => void;
    toggleShowSelection: (id: number, event?: React.MouseEvent) => void;
    expandedShowId: number | null;
    toggleExpandShow: (id: number) => void;
    onEdit: (show: Show) => void;
    shows: Show[];
    setShows: (shows: Show[]) => void;
}

export function ShowsList({
    filteredShows,
    selectedShowIds,
    toggleSelectAll,
    toggleShowSelection,
    expandedShowId,
    toggleExpandShow,
    onEdit,
    shows,
    setShows
}: ShowsListProps) {
    return (
        <div className="space-y-4">
            {/* Table Header */}
            <TableHeader
                filteredShows={filteredShows}
                selectedShowIds={selectedShowIds}
                toggleSelectAll={toggleSelectAll}
            />

            {/* Shows Cards */}
            {filteredShows.map((show) => (
                <ShowCard
                    key={show.id}
                    show={show}
                    isSelected={selectedShowIds.includes(show.id)}
                    isExpanded={expandedShowId === show.id}
                    onSelect={(e) => toggleShowSelection(show.id, e)}
                    onExpand={() => toggleExpandShow(show.id)}
                    onEdit={() => onEdit(show)}
                    shows={shows}
                    setShows={setShows}
                />
            ))}
        </div>
    );
}

interface TableHeaderProps {
    filteredShows: Show[];
    selectedShowIds: number[];
    toggleSelectAll: () => void;
}

function TableHeader({ filteredShows, selectedShowIds, toggleSelectAll }: TableHeaderProps) {
    return (
        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
                <Checkbox
                    checked={selectedShowIds.length === filteredShows.length && filteredShows.length > 0}
                    onClick={toggleSelectAll}
                    className="border-zinc-700"
                />
            </div>
            <div className="col-span-3">Show</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
        </div>
    );
}