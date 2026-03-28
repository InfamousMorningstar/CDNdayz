"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, Calendar, Megaphone, Radio } from 'lucide-react';

export type NewsItem = {
    id: string | number;
    type: 'alert' | 'event' | 'info' | 'update';
    message: string;
    date?: string; // Optional date field (e.g. "2023-10-27" or "Today")
};

const DEFAULT_NEWS: NewsItem[] = [
    { id: 1, type: 'info', message: "Welcome to CDN DayZ. Check out our new server rules.", date: "Today" },
    { id: 2, type: 'event', message: "Community Event: 'Operation Blackout' this Saturday @ 8PM EST.", date: "Sat, 8PM" },
    { id: 3, type: 'alert', message: "Server Maintenance scheduled for Wednesday 4AM - 5AM.", date: "Wed, 4AM" },
];

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
            className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 mb-6 sm:mb-8 relative z-30"
        >
            <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-full px-2 sm:pl-1 sm:pr-6 py-2 sm:py-1.5 flex flex-col sm:flex-row sm:items-center shadow-2xl relative overflow-hidden group gap-2 sm:gap-0">
                
                {/* Pulse Indicator */}
                <div className="bg-neutral-800/80 rounded-full px-2.5 sm:px-3 py-1.5 sm:mr-4 border border-white/5 flex items-center gap-2 shrink-0 self-start sm:self-auto">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">HQ Feed</span>
                </div>

                {/* Message Container */}
                <div className="flex-1 relative h-12 sm:h-6 overflow-hidden min-w-0 w-full">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentItem.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 flex items-start sm:items-center gap-2 sm:gap-3"
                        >
                            <div className="pt-0.5 sm:pt-0 shrink-0">{getIcon(currentItem.type)}</div>
                            <div className="flex items-start sm:items-center gap-2 overflow-hidden min-w-0">
                                {currentItem.date && (
                                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-1.5 py-0.5 rounded border border-white/5 shrink-0 whitespace-nowrap mt-0.5 sm:mt-0">
                                        {currentItem.date}
                                    </span>
                                )}
                                <span className="text-xs sm:text-sm font-medium text-neutral-200 leading-snug cursor-default select-none min-w-0 line-clamp-2 sm:line-clamp-1 break-words">
                                    {currentItem.message}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Optional: Navigation Dots (visible on hover) */}
                <div className="flex justify-center sm:absolute sm:right-4 gap-2 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pb-0.5 sm:pb-0">
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