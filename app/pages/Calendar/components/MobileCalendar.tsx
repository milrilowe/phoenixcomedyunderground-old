import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
// import { Event } from "@/types";


export function MobileCalendarView({ events }: { events: any[] }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const firstDayOfMonth = startOfMonth(selectedMonth);
    const lastDayOfMonth = endOfMonth(selectedMonth);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventsForDate = (date: Date) => {
        return events.filter(event => isSameDay(new Date(event.date), date));
    };

    const getEventsForSelectedDateOrMonth = () => {
        if (selectedDate) {
            return events.filter(event =>
                isSameDay(new Date(event.date), selectedDate)
            );
        }
        return events.filter(event =>
            isSameMonth(new Date(event.date), selectedMonth)
        );
    };

    return (
        <div className="px-4 py-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-50">
                    {format(selectedMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mini Calendar */}
            <Card className="bg-zinc-900 border-zinc-800 p-2 mb-6">
                <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Day headers */}
                    {['S', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].map((day, index) => (
                        <div key={index} className="text-xs font-medium text-zinc-400 py-1">
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {daysInMonth.map((date) => {
                        const dayEvents = getEventsForDate(date);
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        const isCurrentMonth = isSameMonth(date, selectedMonth);

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => {
                                    if (selectedDate && isSameDay(date, selectedDate)) {
                                        setSelectedDate(null);
                                    } else {
                                        setSelectedDate(date);
                                    }
                                }}
                                className={`p-1 relative rounded-full text-xs
                    ${!isCurrentMonth ? 'text-zinc-700' : dayEvents.length > 0 ? 'text-zinc-50' : 'text-zinc-400'}
                    ${isSelected ? 'bg-yellow-500 text-zinc-900' : ''}
                    ${isToday(date) ? 'font-bold' : ''}
                  `}
                            >
                                {format(date, 'd')}
                                {dayEvents.length > 0 && !isSelected && (
                                    <span className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-yellow-500 -translate-x-1/2"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Events List */}
            <div className="space-y-4">
                {selectedDate ? (
                    <h3 className="text-sm font-medium text-zinc-400">
                        Shows for {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                ) : (
                    <h3 className="text-sm font-medium text-zinc-400">
                        All shows in {format(selectedMonth, 'MMMM')}
                    </h3>
                )}

                {getEventsForSelectedDateOrMonth().length > 0 ? (
                    getEventsForSelectedDateOrMonth().map((event) => (
                        <Card key={event.id} className="bg-zinc-900 border-zinc-800">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-zinc-50">{event.name}</h3>
                                        <p className="text-sm text-zinc-400">
                                            {format(new Date(event.date), 'EEE, MMM d')} • {event.showtime}
                                        </p>
                                    </div>
                                    <div className="text-yellow-500 font-medium">
                                        ${event.price}
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
                                    disabled={event.status === 'soldout'}
                                >
                                    {event.status === 'soldout' ? 'Sold Out' : 'Get Tickets'}
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-zinc-400">No shows found for this {selectedDate ? 'date' : 'month'}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}