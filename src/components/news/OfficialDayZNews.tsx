// src/components/news/OfficialDayZNews.tsx
import { getOfficialDayZNews } from '@/lib/dayz-news';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Calendar, Newspaper, Hammer, AlertTriangle, Info, Rss, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function NewsIcon({ category }: { category: string }) {
  switch (category) {
    case 'update': return <Hammer size={16} className="text-emerald-500" />;
    case 'event': return <Calendar size={16} className="text-amber-500" />;
    case 'status-report': return <Newspaper size={16} className="text-sky-500" />;
    case 'changelog': return <Info size={16} className="text-purple-500" />;
    case 'announcement': return <AlertTriangle size={16} className="text-red-500" />;
    default: return <Rss size={16} className="text-neutral-500" />;
  }
}

export async function OfficialDayZNews() {
  const news = await getOfficialDayZNews();

  if (!news || news.length === 0) {
    return (
      <div className="py-8 text-center text-neutral-500 text-sm">
        <p>Latest official news could not be loaded.</p>
        <a href="https://dayz.com/news" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline mt-2 inline-block">
          Visit DayZ.com
        </a>
      </div>
    );
  }

  // Take top 3 for dashboard
  const topNews = news.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-heading font-bold text-white">Official DayZ News</h3>
        </div>
        <a href="https://steamcommunity.com/app/221100/allnews/" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
            View All <ArrowRight size={12} />
        </a>
      </div>

      <div className="grid gap-3">
        {topNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="p-4 bg-neutral-900/40 border-neutral-800 hover:border-red-500/30 transition-all group-hover:bg-neutral-900/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                    <NewsIcon category={item.category} />
                </div>
                
                <div className="pr-6">
                    <h4 className="text-white font-bold text-sm mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
                        {item.title}
                    </h4>
                    
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
                        <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 capitalize text-[10px]">
                            {item.category.replace('-', ' ')}
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-neutral-600 uppercase tracking-wider text-[10px]">
                            {item.source}
                        </span>
                    </div>

                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed group-hover:text-neutral-300 transition-colors">
                        {item.summary.replace(/<[^>]*>?/gm, '')}
                    </p>
                </div>
            </Card>
          </a>
        ))}
      </div>
      
      <div className="text-center pt-2">
         <p className="text-[10px] text-neutral-600 uppercase tracking-widest">
            Source: Steam Community (Official)
         </p>
      </div>
    </div>
  );
}
