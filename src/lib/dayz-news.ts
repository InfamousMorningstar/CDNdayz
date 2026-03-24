import { fetchExampleNews } from "@/lib/news"; // Renamed this so we start fresh with a good function name in next step
import { DayZNewsItem } from "@/types/news";
import * as cheerio from 'cheerio';

const STEAM_APP_ID = '221100';

// Steam usually returns Unix timestamp
function parseSteamSummary(content: string): string {
    // 1. Remove obvious BBCode tags
    let clean = content.replace(/\[\/?(b|i|u|url|quote|code|list|olist|h1|h2|h3)\].*?\[\/?\1\]/g, ''); 
    // 2. Remove raw HTML tags
    clean = clean.replace(/<[^>]*>?/g, ''); 
    // 3. Trim specific "View full event info here" type links often at the end
    clean = clean.replace(/View full event info here.*/, '');
    // 4. Decode entities using cheerio
    const $ = cheerio.load(clean);
    clean = $.text();
    // 5. Truncate
    return clean.substring(0, 160).trim() + (clean.length > 160 ? '...' : '');
}

export async function getOfficialDayZNews(): Promise<DayZNewsItem[]> {
  try {
    // Steam News API (GET)
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetNewsForApp_.28v0002.29
    const url = `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${STEAM_APP_ID}&count=5&maxlength=300&format=json`;
    
    // Validating with DayZ website is tricky without an API, so we stick to Steam as primary source for reliability.
    // We define revalidation here for ISR
    const res = await fetch(url, { next: { revalidate: 1800 } }); // 30 minutes

    if (!res.ok) {
        throw new Error(`Failed to fetch news: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const items = data?.appnews?.newsitems || [];

    const news: DayZNewsItem[] = items.map((item: any) => {
        const titleLower = item.title.toLowerCase();
        let category: DayZNewsItem['category'] = 'other';
        
        if (titleLower.includes('update') || titleLower.includes('patch') || titleLower.includes('hotfix')) category = 'update';
        else if (titleLower.includes('event') || titleLower.includes('contest')) category = 'event';
        else if (titleLower.includes('status report')) category = 'status-report';
        else if (titleLower.includes('changelog')) category = 'changelog';
        else if (titleLower.includes('maintenance')) category = 'announcement';

        return {
            id: item.gid,
            title: item.title,
            url: item.url,
            publishedAt: new Date(item.date * 1000).toISOString(),
            summary: parseSteamSummary(item.contents || ''),
            source: 'steam',
            category,
            // Steam API typically returns 'contents' which might contain image URLs in BBCode/HTML
            // Parsing image is unreliable without full content fetching, so we skip it for performance/stability.
            image: undefined 
        };
    });

    return news;

  } catch (error) {
    console.error("Error loading official news:", error);
    // Return empty array to allow UI to show fallback or empty state gracefully without crashing page
    return [];
  }
}
