import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
// import { Event } from "@/types";

export function DesktopCalendarView({ events }: { events: any[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventsForDate = (date: Date) => {
        return events.filter(event => isSameDay(new Date(event.date), date));
    };

    return (
        <div className="px-4 py-6">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-50">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px">
                    {/* Day headers */}
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <div key={day} className="text-center font-medium text-zinc-400 mb-2">
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {daysInMonth.map((date) => {
                        const dayEvents = getEventsForDate(date);
                        const isCurrentMonth = isSameMonth(date, currentMonth);

                        return (
                            <div
                                key={date.toISOString()}
                                className={`min-h-[120px] border border-zinc-800 relative flex flex-col
                    ${isCurrentMonth ? 'bg-zinc-900' : 'bg-zinc-950'} 
                    ${isToday(date) ? 'bg-zinc-800/50' : ''}
                  `}
                            >
                                <span className={`absolute top-1 left-2 text-sm
                    ${isCurrentMonth ? 'text-zinc-400' : 'text-zinc-700'}`}>
                                    {format(date, 'd')}
                                </span>

                                <div className="mt-8 px-1 space-y-1">
                                    {dayEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="text-sm rounded bg-zinc-800/50 p-2"
                                        >
                                            <div className="font-medium text-zinc-50 truncate">
                                                {event.name}
                                            </div>
                                            <div className="text-zinc-400 text-xs">{event.showtime}</div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-yellow-500">${event.price}</span>
                                                {event.status === 'soldout' ? (
                                                    <Button
                                                        size="sm"
                                                        className="h-6 text-xs bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
                                                    >
                                                        Book
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}