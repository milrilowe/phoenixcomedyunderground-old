// app/pages/Dashboard/components/Shows/ShowCard.tsx
import React, { JSX, useState } from 'react';
import { format } from 'date-fns';
import { Show } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Star, EyeOff, Edit, Trash2, MoreHorizontal, Calendar
} from 'lucide-react';
import {
    deleteShow, toggleShowFeatured, toggleShowPublished, updateShowStatus
} from '@/lib/actions/shows';
import { toast } from 'sonner';

interface ShowCardProps {
    show: Show;
    isSelected: boolean;
    isExpanded: boolean;
    onSelect: (event: React.MouseEvent) => void;
    onExpand: () => void;
    onEdit: () => void;
    shows: Show[];
    setShows: React.Dispatch<React.SetStateAction<Show[]>>;
}

export function ShowCard({
    show,
    isSelected,
    isExpanded,
    onSelect,
    onExpand,
    onEdit,
    shows,
    setShows
}: ShowCardProps) {
    // Format price display
    const formatPrice = (price: any): string => {
        if (!price) return 'Free';
        const numPrice = parseFloat(price.toString());
        return `$${numPrice.toFixed(2)}`;
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge className="bg-green-600 text-white">Scheduled</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
            case 'soldout':
                return <Badge className="bg-yellow-500 text-black">Sold Out</Badge>;
            default:
                return <Badge className="bg-zinc-600 text-white">{status}</Badge>;
        }
    };

    // Handle deleting a show
    const handleDeleteShow = async (id: number) => {
        if (confirm('Are you sure you want to delete this show?')) {
            try {
                const result = await deleteShow({ data: id });

                if (!result.success) {
                    toast.error(`Failed to delete show: ${result.message}`);
                    return;
                }

                setShows((prevShows: Show[]) => prevShows.filter(show => show.id !== id));
                toast.success('Show deleted successfully');
            } catch (error) {
                toast.error('Failed to delete show');
                console.error(error);
            }
        }
    };

    // Handle toggling featured status
    const handleToggleFeatured = async (id: number) => {
        try {
            const result = await toggleShowFeatured({ data: id });

            if (!result.success) {
                toast.error(`Failed to update featured status: ${result.message}`);
                return;
            }

            setShows(prevShows =>
                prevShows.map(show =>
                    show.id === id ? { ...show, featured: !show.featured } : show
                )
            );

            toast.success(`Show ${result.show.featured ? 'featured' : 'unfeatured'} successfully`);
        } catch (error) {
            toast.error('Failed to update featured status');
            console.error(error);
        }
    };

    // Handle toggling published status
    const handleTogglePublished = async (id: number) => {
        try {
            const result = await toggleShowPublished({ data: id });

            if (!result.success) {
                toast.error(`Failed to update published status: ${result.message}`);
                return;
            }

            setShows(prevShows =>
                prevShows.map(show =>
                    show.id === id ? { ...show, published: !show.published } : show
                )
            );

            toast.success(`Show ${result.show.published ? 'published' : 'unpublished'} successfully`);
        } catch (error) {
            toast.error('Failed to update published status');
            console.error(error);
        }
    };

    // Handle updating show status
    const handleUpdateStatus = async (id: number, status: 'scheduled' | 'cancelled' | 'soldout') => {
        try {
            const result = await updateShowStatus({ data: { id, status } });

            if (!result.success) {
                toast.error(`Failed to update status: ${result.message}`);
                return;
            }

            setShows(prevShows =>
                prevShows.map(show =>
                    show.id === id ? { ...show, status } : show
                )
            );

            toast.success(`Show status updated to ${status}`);
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    return (
        <Card
            className={`bg-zinc-900 border-zinc-800 overflow-hidden
                hover:border-zinc-700 transition-colors
                ${!show.published ? 'opacity-75' : ''}
                ${isSelected ? 'border-yellow-500/50' : ''}`}
        >
            {/* Desktop View */}
            <DesktopView
                show={show}
                isSelected={isSelected}
                isExpanded={isExpanded}
                onSelect={onSelect}
                onExpand={onExpand}
                onEdit={onEdit}
                handleDeleteShow={handleDeleteShow}
                handleToggleFeatured={handleToggleFeatured}
                handleTogglePublished={handleTogglePublished}
                handleUpdateStatus={handleUpdateStatus}
                formatPrice={formatPrice}
                getStatusBadge={getStatusBadge}
            />

            {/* Mobile View */}
            <MobileView
                show={show}
                isSelected={isSelected}
                isExpanded={isExpanded}
                onSelect={onSelect}
                onExpand={onExpand}
                onEdit={onEdit}
                handleDeleteShow={handleDeleteShow}
                handleToggleFeatured={handleToggleFeatured}
                handleTogglePublished={handleTogglePublished}
                handleUpdateStatus={handleUpdateStatus}
                formatPrice={formatPrice}
                getStatusBadge={getStatusBadge}
            />
        </Card>
    );
}

interface ViewProps {
    show: Show;
    isSelected: boolean;
    isExpanded: boolean;
    onSelect: (event: React.MouseEvent) => void;
    onExpand: () => void;
    onEdit: () => void;
    handleDeleteShow: (id: number) => Promise<void>;
    handleToggleFeatured: (id: number) => Promise<void>;
    handleTogglePublished: (id: number) => Promise<void>;
    handleUpdateStatus: (id: number, status: 'scheduled' | 'cancelled' | 'soldout') => Promise<void>;
    formatPrice: (price: any) => string;
    getStatusBadge: (status: string) => JSX.Element;
}

function DesktopView({
    show,
    isSelected,
    isExpanded,
    onSelect,
    onExpand,
    onEdit,
    handleDeleteShow,
    handleToggleFeatured,
    handleTogglePublished,
    handleUpdateStatus,
    formatPrice,
    getStatusBadge
}: ViewProps) {
    return (
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 items-center">
            <div className="col-span-1">
                <Checkbox
                    checked={isSelected}
                    onClick={onSelect}
                    className="border-zinc-700"
                />
            </div>
            <div className="col-span-3">
                <div className="flex">
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate ${show.featured ? 'text-yellow-500' : 'text-white'}`}>
                            {show.title}
                        </h3>
                        <div className="text-xs text-zinc-400 mt-1">
                            {show.performers || 'No performers listed'}
                        </div>
                    </div>
                    {show.featured && (
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 ml-2" />
                    )}
                    {!show.published && (
                        <EyeOff className="h-4 w-4 text-zinc-500 flex-shrink-0 ml-2" />
                    )}
                </div>
            </div>
            <div className="col-span-2 text-zinc-300">
                <div>{format(new Date(show.date), 'MMM d, yyyy')}</div>
                <div className="text-xs text-zinc-500 mt-1">
                    {format(new Date(show.time), 'h:mm a')}
                </div>
            </div>
            <div className="col-span-2 text-zinc-300 truncate">
                {show.venue || show.location || 'No location set'}
            </div>
            <div className="col-span-2">
                <div className="flex items-center gap-2">
                    {getStatusBadge(show.status)}
                    {show.price && (
                        <span className="text-yellow-500 font-medium">
                            {formatPrice(show.price)}
                        </span>
                    )}
                </div>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-400 hover:text-zinc-100"
                    onClick={onEdit}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-400 hover:text-red-400"
                    onClick={() => handleDeleteShow(show.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 text-zinc-400 hover:text-zinc-100"
                        onClick={onExpand}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {isExpanded && (
                        <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 border border-zinc-700">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <button
                                    className="text-left w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center"
                                    onClick={() => handleToggleFeatured(show.id)}
                                >
                                    <Star className="h-4 w-4 mr-2" />
                                    {show.featured ? 'Remove from featured' : 'Mark as featured'}
                                </button>
                                <button
                                    className="text-left w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center"
                                    onClick={() => handleTogglePublished(show.id)}
                                >
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    {show.published ? 'Unpublish' : 'Publish'}
                                </button>
                                <div className="border-t border-zinc-700 my-1"></div>
                                <button
                                    className="text-left w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center"
                                    onClick={() => handleUpdateStatus(show.id, 'scheduled')}
                                    disabled={show.status === 'scheduled'}
                                >
                                    Set as Scheduled
                                </button>
                                <button
                                    className="text-left w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center"
                                    onClick={() => handleUpdateStatus(show.id, 'cancelled')}
                                    disabled={show.status === 'cancelled'}
                                >
                                    Mark as Cancelled
                                </button>
                                <button
                                    className="text-left w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center"
                                    onClick={() => handleUpdateStatus(show.id, 'soldout')}
                                    disabled={show.status === 'soldout'}
                                >
                                    Mark as Sold Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MobileView({
    show,
    isSelected,
    isExpanded,
    onSelect,
    onExpand,
    onEdit,
    handleDeleteShow,
    handleToggleFeatured,
    handleTogglePublished,
    handleUpdateStatus,
    formatPrice,
    getStatusBadge
}: ViewProps) {
    return (
        <div className="lg:hidden p-4">
            <div className="flex items-start gap-3">
                <Checkbox
                    checked={isSelected}
                    onClick={onSelect}
                    className="border-zinc-700 mt-1"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className={`font-semibold truncate ${show.featured ? 'text-yellow-500' : 'text-white'}`}>
                            {show.title}
                        </h3>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            {show.featured && (
                                <Star className="h-4 w-4 text-yellow-500" />
                            )}
                            {!show.published && (
                                <EyeOff className="h-4 w-4 text-zinc-500" />
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        {format(new Date(show.date), 'MMM d, yyyy')} • {format(new Date(show.time), 'h:mm a')}
                    </div>

                    {(show.venue || show.location) && (
                        <div className="mt-1 text-sm text-zinc-400">
                            {show.venue || show.location}
                        </div>
                    )}

                    <div className="mt-3 flex items-center flex-wrap gap-2">
                        {getStatusBadge(show.status)}
                        {show.price && (
                            <span className="text-yellow-500 font-medium text-sm">
                                {formatPrice(show.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-100"
                    onClick={onExpand}
                >
                    <MoreHorizontal className="h-4 w-4 mr-1" />
                    Options
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-zinc-100"
                        onClick={onEdit}
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-red-400"
                        onClick={() => handleDeleteShow(show.id)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Expanded Options on Mobile */}
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 text-zinc-300"
                        onClick={() => handleToggleFeatured(show.id)}
                    >
                        <Star className="h-4 w-4 mr-2" />
                        {show.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 text-zinc-300"
                        onClick={() => handleTogglePublished(show.id)}
                    >
                        <EyeOff className="h-4 w-4 mr-2" />
                        {show.published ? 'Unpublish' : 'Publish'}
                    </Button>

                    <div className="col-span-2 mt-2">
                        <h4 className="text-xs font-medium text-zinc-500 mb-2">UPDATE STATUS:</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant={show.status === 'scheduled' ? 'default' : 'outline'}
                                size="sm"
                                className={show.status === 'scheduled'
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'border-zinc-700 text-zinc-300'
                                }
                                onClick={() => handleUpdateStatus(show.id, 'scheduled')}
                                disabled={show.status === 'scheduled'}
                            >
                                Scheduled
                            </Button>
                            <Button
                                variant={show.status === 'cancelled' ? 'default' : 'outline'}
                                size="sm"
                                className={show.status === 'cancelled'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'border-zinc-700 text-zinc-300'
                                }
                                onClick={() => handleUpdateStatus(show.id, 'cancelled')}
                                disabled={show.status === 'cancelled'}
                            >
                                Cancelled
                            </Button>
                            <Button
                                variant={show.status === 'soldout' ? 'default' : 'outline'}
                                size="sm"
                                className={show.status === 'soldout'
                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                    : 'border-zinc-700 text-zinc-300'
                                }
                                onClick={() => handleUpdateStatus(show.id, 'soldout')}
                                disabled={show.status === 'soldout'}
                            >
                                Sold Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}