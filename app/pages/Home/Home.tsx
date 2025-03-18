import { MailingListDialog } from "@/components";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { MobileFeaturedShows } from "./components";

export function Home() {
    return (
        <main className="min-h-[calc(100vh-var(--navbar-height)-var(--app-layout-padding))] flex flex-col justify-around overflow-hidden">
            {/* Hero Section */}
            <div className="relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-50">
                            Phoenix&apos;s Best Underground Comedy
                        </h1>
                        <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-zinc-400">
                            Live standup comedy featuring the best local and touring comedians.
                        </p>
                        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-x-6">
                            <Link to="/calendar" className="text-sm font-medium transition-all bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center rounded-md p-2 px-4">
                                View Upcoming Shows
                            </Link>
                            <div className="sm:w-auto w-full">
                                <MailingListDialog />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Shows Section */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">Featured Shows</h2>
                        <Link to="/calendar" className="text-zinc-400 hover:text-zinc-300 text-sm font-medium underline-offset-4 hover:underline">
                            See Full Schedule
                        </Link>
                    </div>

                    {/* Mobile Carousel (visible on medium screens and below) */}
                    <div className="block lg:hidden w-full overflow-hidden">
                        <MobileFeaturedShows />
                    </div>

                    {/* Desktop Grid (hidden on medium screens and below) */}
                    <div className="hidden lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Featured Show Card */}
                        <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-zinc-700 transition-colors">
                            <div className="p-4 sm:p-6">
                                <div className="text-yellow-500 text-sm font-semibold mb-2">THIS WEEKEND</div>
                                <h3 className="text-xl font-bold text-zinc-50 mb-2">Headliner Show</h3>
                                <p className="text-zinc-400 mb-4">Fri Jan 26 • 8:00 PM</p>
                                <Button className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors">
                                    Get Tickets
                                </Button>
                            </div>
                        </Card>

                        {/* More Show Cards */}
                        <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-zinc-700 transition-colors">
                            <div className="p-4 sm:p-6">
                                <div className="text-yellow-500 text-sm font-semibold mb-2">NEXT WEEK</div>
                                <h3 className="text-xl font-bold text-zinc-50 mb-2">Comedy Showcase</h3>
                                <p className="text-zinc-400 mb-4">Fri Feb 2 • 8:00 PM</p>
                                <Button className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors">
                                    Get Tickets
                                </Button>
                            </div>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-zinc-700 transition-colors">
                            <div className="p-4 sm:p-6">
                                <div className="text-yellow-500 text-sm font-semibold mb-2">WEEKLY</div>
                                <h3 className="text-xl font-bold text-zinc-50 mb-2">Open Mic Night</h3>
                                <p className="text-zinc-400 mb-4">Every Thursday • 8:00 PM</p>
                                <Button className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors">
                                    Get Tickets
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}