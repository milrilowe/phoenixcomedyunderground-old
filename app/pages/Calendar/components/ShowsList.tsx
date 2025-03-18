import { MailingListDialog } from "@/components";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Mail, Mic } from "lucide-react";

export function ShowsList({ events }: { events: Array<any> }) {

    return (
        <div className="space-y-6 p-4">
            {events.map((event) => (
                <div key={event.id} className="flex flex-col md:flex-row gap-4 p-4 bg-zinc-900 rounded-lg">
                    <div className="md:w-48">
                        <img
                            src={event.image ?? '/images/phx-comedy-underground.png'}
                            alt={event.name}
                            className="w-full aspect-square object-cover rounded-lg"
                        />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-1">{event.name}</h3>
                            <p className="text-lg text-white mb-4">
                                {format(new Date(event.date), 'MMMM d')} - {event.showtime}
                            </p>

                            <p className="text-zinc-400 mb-4 line-clamp-2">
                                {event.description}
                            </p>
                        </div>

                        <div className="mt-auto flex justify-end">
                            <button className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors">
                                Buy Tickets
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}