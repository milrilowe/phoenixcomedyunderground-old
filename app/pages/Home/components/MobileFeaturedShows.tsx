import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const shows = [
    {
        id: 1,
        badge: "THIS WEEKEND",
        title: "Headliner Show",
        date: "Fri Jan 26 • 8:00 PM",
    },
    {
        id: 2,
        badge: "NEXT WEEK",
        title: "Comedy Showcase",
        date: "Fri Feb 2 • 8:00 PM",
    },
    {
        id: 3,
        badge: "WEEKLY",
        title: "Open Mic Night",
        date: "Every Thursday • 8:00 PM",
    }
];

export const MobileFeaturedShows = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const swipeRef = useRef(null);

    // Auto-advance the carousel every 5 seconds when not interacting
    useEffect(() => {
        if (isSwiping) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [activeIndex, isSwiping]);

    const nextSlide = () => {
        setActiveIndex((current) => (current === shows.length - 1 ? 0 : current + 1));
    };

    const prevSlide = () => {
        setActiveIndex((current) => (current === 0 ? shows.length - 1 : current - 1));
    };

    // Touch handlers
    const handleTouchStart = (e) => {
        // Reset to current touch position
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchEnd = (e) => {
        if (!isSwiping) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // Threshold of 50px for a swipe
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swiped left, go to next
                nextSlide();
            } else {
                // Swiped right, go to previous
                prevSlide();
            }
        }

        // Reset swiping state
        setIsSwiping(false);
        setStartX(0); // Reset start position
    };

    // Mouse handlers for desktop testing
    const handleMouseDown = (e) => {
        // Reset to current mouse position
        setStartX(e.clientX);
        setIsSwiping(true);

        // Add event listeners for mouse movement
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        // Optional: Could add visual feedback during swipe
    };

    const handleMouseUp = (e) => {
        if (!isSwiping) return;

        const diffX = startX - e.clientX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swiped left, go to next
                nextSlide();
            } else {
                // Swiped right, go to previous
                prevSlide();
            }
        }

        // Reset swiping state
        setIsSwiping(false);
        setStartX(0); // Reset start position

        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="relative w-full">
            {/* Carousel Container */}
            <div
                ref={swipeRef}
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                    setIsSwiping(false);
                    setStartX(0);
                }}
                onMouseDown={handleMouseDown}
            >
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {shows.map((show) => (
                        <div key={show.id} className="w-full flex-shrink-0 px-2">
                            <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-zinc-700 transition-colors">
                                <div className="p-4 sm:p-6">
                                    <div className="text-yellow-500 text-sm font-semibold mb-2">{show.badge}</div>
                                    <h3 className="text-xl font-bold text-zinc-50 mb-2">{show.title}</h3>
                                    <p className="text-zinc-400 mb-4">{show.date}</p>
                                    <Button className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors">
                                        Get Tickets
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-4 gap-2">
                {shows.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full transition-all ${activeIndex === index ? "w-6 bg-yellow-500" : "w-2 bg-zinc-700"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};