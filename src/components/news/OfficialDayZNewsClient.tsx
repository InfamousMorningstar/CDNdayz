// src/components/news/OfficialDayZNewsClient.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowUpRight, Calendar, Tag, AlertCircle, Newspaper, Hammer } from 'lucide-react';
import { DayZNewsItem } from '@/types/news';

// Icon mapper
const getIcon = (category: string) => {
  switch(category) {
    case 'update': return <Hammer className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />;
    case 'maintenance': return <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />;
    case 'event': return <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />;
    default: return <Newspaper className="w-3 h-3 md:w-4 md:h-4 text-neutral-500" />;
  }
}

export function OfficialDayZNewsClient() {
  const [news, setNews] = useState<DayZNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        // We need an API route to bridge the server-side fetch to the client
        // Create this route next!
        const res = await fetch('/api/news');
        if(!res.ok) throw new Error('API Failed');
        const data = await res.json();
        setNews(data.slice(0, 3)); // Top 3
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-neutral-900/40 rounded-lg border border-neutral-800" />
        ))}
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
        <div className="p-4 bg-neutral-900/30 border border-neutral-800 rounded-lg text-center">
            <p className="text-neutral-500 text-sm">Unable to load official news feed.</p>
        </div>
    );
  }

  return (
    <div className="space-y-3">
        {news.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block"
            >
                <Card className="bg-neutral-900/40 hover:bg-neutral-900/80 border-neutral-800 hover:border-red-500/30 transition-all p-4 relative overflow-hidden">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${
                                    item.category === 'update' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    item.category === 'announcement' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    item.category === 'event' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                    'bg-neutral-800 border-neutral-700 text-neutral-400'
                                }`}>
                                    {item.category}
                                </span>
                                <span className="text-neutral-600 text-[10px] flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.publishedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                </span>
                            </div>

                            <h4 className="text-neutral-200 group-hover:text-red-400 font-bold text-sm leading-tight transition-colors line-clamp-1 mb-1">
                                {item.title}
                            </h4>

                            <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                                {item.summary}
                            </p>
                        </div>
                        
                        <div className="text-neutral-600 group-hover:text-red-500 transition-colors pt-1">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
            </a>
        ))}
        
        <div className="pt-2 text-center border-t border-white/5">
             <a href="https://dayz.com/news" target="_blank" className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors">
                View All Official Updates &rarr;
             </a>
        </div>
    </div>
  );
}
