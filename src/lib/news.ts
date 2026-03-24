// src/lib/news.ts
import { DayZNewsItem, NewsCategory } from '@/types/news';
import * as cheerio from 'cheerio';

const STEAM_APP_ID = '221100';
const STEAM_NEWS_API = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${STEAM_APP_ID}&count=10&maxlength=300&format=json`;

// Cache duration in seconds (revalidate every 15 minutes)
export const REVALIDATE_TIME = 900; 

function classifyNewsCategory(title: string): NewsCategory {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('update') || lowerTitle.includes('patch') || lowerTitle.includes('hotfix')) {
    return 'update';
  }
  if (lowerTitle.includes('event') || lowerTitle.includes('contest') || lowerTitle.includes('celebration')) {
    return 'event';
  }
  if (lowerTitle.includes('status report') || lowerTitle.includes('devblog')) {
    return 'status-report';
  }
  if (lowerTitle.includes('changelog') || lowerTitle.includes('notes')) {
    return 'changelog';
  }
  if (lowerTitle.includes('maintenance') || lowerTitle.includes('service') || lowerTitle.includes('downtime')) {
    return 'announcement';
  }
  
  return 'other';
}

function cleanSteamContent(content: string): string {
    // Steam sometimes returns BBCode or raw HTML.
    // We want to strip it down to a clean summary.

    // 1. Remove Steam specific BBCode like [img], [url], etc if present in "contents" (though maxlength usually handles this)
    let clean = content.replace(/\[.*?\]/g, '');

    // 2. Remove HTML tags if present
    clean = clean.replace(/<[^>]*>?/g, '');

    // 3. Fix potential encoding issues or extra spaces
    clean = clean.replace(/\s+/g, ' ').trim();

    // 4. Decode HTML entities
    const $ = cheerio.load(clean);
    return $.text().substring(0, 160) + (clean.length > 160 ? '...' : '');
}

function extractImage(content: string): string | undefined {
    // Try to find an image in the content if Steam provides the full HTML content
    // Note: The 'maxlength' param in the API URL limits content, so we might not get images this way.
    // However, for the purpose of a summary card, we might not need to fetch the full content.
    // Making a separate request for full content for every item slows down the page significantly.
    // We will stick to text-only or use a default image for now unless a convenient image source is found.
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    if(match) return match[1];

    // BBCode match
    const bbMatch = content.match(/\[img\](.*?)\[\/img\]/);
    if(bbMatch) return bbMatch[1];
    
    return undefined;
}

export async function fetchExampleNews(): Promise<DayZNewsItem[]> {
    // This function will fetch from Steam News API
    try {
        const response = await fetch(STEAM_NEWS_API, {
            next: { revalidate: REVALIDATE_TIME }
        });

        if (!response.ok) {
            throw new Error(`Steam API rejected request: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.appnews || !data.appnews.newsitems) {
             console.warn('Steam API structure changed or empty');
             return [];
        }

        const newsItems = data.appnews.newsitems;

        return newsItems.map((item: any) => {
            // Steam returns a unix timestamp
            const date = new Date(item.date * 1000);
            const category = classifyNewsCategory(item.title);
            
            // Extract a summary from the 'contents' field
            // The API 'contents' field is often truncated if maxlength is set, which is good for bandwidth
            const summary = cleanSteamContent(item.contents);

            return {
                id: item.gid,
                title: item.title,
                url: item.url, // Steam provides a link to the news post
                publishedAt: date.toISOString(),
                summary: summary,
                source: 'steam',
                category: category,
                // Steam API v2 doesn't always provide a clean image URL in the list view
                // We'll rely on our UI to show a category icon or default image
                image: undefined 
            };
        });

    } catch (error) {
        console.error('Error fetching Steam news:', error);
        // Fallback or empty array. 
        // In a production app you might want to read from a local cache file if the API fails.
        return [];
    }
}
