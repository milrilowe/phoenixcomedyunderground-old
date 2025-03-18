import { Calendar, Home, Mic, Mic2, Ticket, Tickets } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center text-white p-4 max-h-[calc(100vh - 65px)]">
            {/* 404 Message */}
            <div className="text-center mb-8">
                <h2 className="text-8xl font-bold text-yellow-400 mb-4">404</h2>
                <h3 className="text-2xl mb-6">This joke fell flat.</h3>
                <p className="max-w-md mb-8 text-gray-400">
                    The page you're looking for seems to have left the stage. Maybe it's grabbing a drink at the bar?
                </p>
            </div>

            {/* Fun Comedy Elements */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex flex-col items-center p-4 border border-gray-800 rounded-lg bg-gray-900 w-32">
                    <Mic2 className="h-8 w-8 text-yellow-400 mb-2" />
                    <span className="text-sm text-gray-400 text-center">Missing Punchline</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-800 rounded-lg bg-gray-900 w-32 justify-around">
                    <Tickets className="h-8 w-8 text-yellow-400 mb-2" />
                    <span className="text-sm text-gray-400 text-center">Wrong Venue</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/" className="border-zinc-800 bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors text-sm font-medium transition-all flex items-center rounded-md p-2 px-4">
                    Back to Home
                </Link>
                <Link to="/calendar" className="text-sm font-medium transition-all bg-white text-black hover:bg-neutral-200 transition-colors flex items-center rounded-md p-2 px-4">
                    View Upcoming Shows
                </Link>
            </div>
        </div>
    );
};