"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, Calendar, Megaphone } from 'lucide-react';

export type NewsItem = {
    id: string | number;
    type: 'alert' | 'event' | 'info' | 'update';
    message: string;
    date?: string;
    publishedAt?: string;
};

const DEFAULT_NEWS: NewsItem[] = [
    { id: 1, type: 'info', message: "Welcome to CDN DayZ. Check out our new server rules.", date: "Today" },
    { id: 2, type: 'event', message: "Community Event: 'Operation Blackout' this Saturday @ 8PM EST.", date: "Sat, 8PM" },
    { id: 3, type: 'alert', message: "Server Maintenance scheduled for Wednesday 4AM - 5AM.", date: "Wed, 4AM" },
];

function formatDisplayDate(item: NewsItem): string | undefined {
    if (!item.publishedAt) {
        return item.date;
    }

    const parsedDate = new Date(item.publishedAt);
    if (Number.isNaN(parsedDate.getTime())) {
        return item.date;
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(parsedDate);
}

export function NewsTicker() {
    const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch news from internal API to avoid exposing Gist URL and handle caching
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news-ticker');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setNews(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch news ticker:", error);
            }
        };

        fetchNews();
        
        // Refresh every 60 seconds
        const refreshInterval = setInterval(fetchNews, 60 * 1000); 
        return () => clearInterval(refreshInterval);
    }, []);

    // Auto-cycle through messages
    useEffect(() => {
        if (news.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer);
    }, [news.length]);

    const currentItem = news[currentIndex];
    const currentItemDate = formatDisplayDate(currentItem);

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
            case 'update': return <Megaphone className="w-4 h-4 text-green-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    if (!news.length) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-5xl self-start mr-auto mt-8 sm:mt-12 mb-6 sm:mb-8 relative z-30 text-left"
        >
            <div className="px-2 sm:px-4 py-2 flex flex-col relative group gap-2 sm:gap-3">
                {/* Pulse Indicator */}
                <div className="rounded-full px-2.5 sm:px-3 py-1.5 border border-white/10 bg-black/25 backdrop-blur-sm flex items-center gap-2 shrink-0 self-start shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-300">HQ Feed</span>
                </div>

                {/* Message Container */}
                <div className="flex-1 relative min-h-[3.5rem] sm:min-h-[4.5rem] min-w-0 w-full">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentItem.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative flex items-start gap-2 sm:gap-3"
                        >
                            <div className="pt-0.5 shrink-0 text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{getIcon(currentItem.type)}</div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-start gap-1 sm:gap-2 min-w-0">
                                {currentItemDate && (
                                    <span className="text-[11px] sm:text-xs font-mono text-neutral-300 bg-black/25 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm shrink-0 whitespace-nowrap mt-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
                                        {currentItemDate}
                                    </span>
                                )}
                                <span className="text-base sm:text-lg font-semibold text-neutral-50 leading-relaxed cursor-default select-none min-w-0 line-clamp-4 sm:line-clamp-3 break-words drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]">
                                    {currentItem.message}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Optional: Navigation Dots (visible on hover) */}
                <div className="flex justify-start gap-2 sm:gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pb-0.5 sm:pb-0 shrink-0">
                    {news.map((_, idx) => (
                        <button
                            type="button"
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Show news item ${idx + 1}`}
                            className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 ${idx === currentIndex ? 'bg-white' : 'bg-white/20 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}