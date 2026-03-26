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

    // Fetch news from Gist
    useEffect(() => {
        // Use the raw URL without the commit hash to always get the latest version
        const NEWS_URL = 'https://gist.githubusercontent.com/InfamousMorningstar/3051bd07566e72be5c52d560130b8b71/raw/news.json';
        
        const fetchNews = async () => {
            try {
                // Add a timestamp to prevent caching
                const response = await fetch(`${NEWS_URL}?t=${Date.now()}`);
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
        
        // Refresh every 30 seconds
        const refreshInterval = setInterval(fetchNews, 30 * 1000); 
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
            className="w-full max-w-2xl mx-auto mt-12 mb-8 relative z-30"
        >
            <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-full pl-1 pr-6 py-1.5 flex items-center shadow-2xl relative overflow-hidden group">
                
                {/* Pulse Indicator */}
                <div className="bg-neutral-800/80 rounded-full px-3 py-1.5 mr-4 border border-white/5 flex items-center gap-2 shrink-0">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">HQ Feed</span>
                </div>

                {/* Message Container */}
                <div className="flex-1 relative h-6 overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentItem.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center gap-3"
                        >
                            {getIcon(currentItem.type)}
                            <div className="flex items-center gap-2 overflow-hidden">
                                {currentItem.date && (
                                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-1.5 py-0.5 rounded border border-white/5 shrink-0 whitespace-nowrap">
                                        {currentItem.date}
                                    </span>
                                )}
                                <span className="text-sm font-medium text-neutral-200 truncate cursor-default select-none">
                                    {currentItem.message}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Optional: Navigation Dots (visible on hover) */}
                <div className="absolute right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {news.map((_, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/20 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}