import { MailingListDialog } from "@/components";
import { DesktopCalendarView, MobileCalendarView, ShowsList, ViewToggle } from "./components";
import { CalendarIcon, Mic } from "lucide-react";

export function Calendar() {
    const events = [];

    if (events.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Microphone Stage Icon */}
            <div className="mb-6 relative">
                <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Mic className="h-12 w-12 text-yellow-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-800">
                    <CalendarIcon className="h-5 w-5 text-zinc-400" />
                </div>
            </div>

            {/* Main heading */}
            <h2 className="text-3xl font-bold text-white mb-3">Intermission</h2>

            {/* Fun comedy-themed message */}
            <p className="text-zinc-400 max-w-md mb-6">
                Our comedians are busy writing new jokes! Check back soon or join our mailing list to be the first to know when new shows are announced.
            </p>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-4">
                <MailingListDialog />
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto py-4">
            <ViewToggle>
                {(view) => (
                    view === 'list' ? (
                        <ShowsList events={events} />
                    ) : (
                        <>
                            <div className="hidden md:block">
                                <DesktopCalendarView events={events} />
                            </div>
                            <div className="md:hidden w-full">
                                <MobileCalendarView events={events} />
                            </div>
                        </>
                    )
                )}
            </ViewToggle>
        </div>
    )
}