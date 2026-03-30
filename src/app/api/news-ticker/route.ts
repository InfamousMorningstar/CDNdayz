import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const NEWS_FILE = join(process.cwd(), 'src/data/news-feed.json');
const NEWS_KEY = 'cdn:news-feed';

function verifyAdminToken(req: NextRequest): boolean {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return false;
    }
    return authHeader.slice(7).length > 0;
}

async function readNews() {
    // Use Vercel KV in production
    if (process.env.KV_URL) {
        try {
            const { kv } = await import('@vercel/kv');
            const data = await kv.get(NEWS_KEY);
            return data || [];
        } catch (error) {
            console.error('Error reading from Vercel KV:', error);
            // Fallback to file system
        }
    }

    // Fallback to local file system (development)
    try {
        const content = await fs.readFile(NEWS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading news file:', error);
        return [];
    }
}

async function writeNews(data: any) {
    // Use Vercel KV in production
    if (process.env.KV_URL) {
        try {
            const { kv } = await import('@vercel/kv');
            await kv.set(NEWS_KEY, data);
            return true;
        } catch (error) {
            console.error('Error writing to Vercel KV:', error);
            // Fallback to file system
        }
    }

    // Fallback to local file system (development)
    try {
        await fs.writeFile(NEWS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing news file:', error);
        return false;
    }
}

export async function GET() {
    try {
        const news = await readNews();
        return NextResponse.json(news);
    } catch (error) {
        console.error('Error fetching news ticker:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news ticker' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Verify admin token
        if (!verifyAdminToken(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const newsData = await request.json();

        // Validate news data is an array
        if (!Array.isArray(newsData)) {
            return NextResponse.json(
                { error: 'News data must be an array' },
                { status: 400 }
            );
        }

        // Write to file
        const success = await writeNews(newsData);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to save news' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'News updated successfully' });
    } catch (error) {
        console.error('Error updating news ticker:', error);
        return NextResponse.json(
            { error: 'Failed to update news ticker' },
            { status: 500 }
        );
    }
}
