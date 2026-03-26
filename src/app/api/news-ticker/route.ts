import { NextResponse } from 'next/server';

export const revalidate = 60; // 1 minute cache

const GIST_ID = '3051bd07566e72be5c52d560130b8b71';
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

export async function GET() {
    try {
        const response = await fetch(GIST_API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Optional: Add GitHub Token here if rate limits become an issue
                // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
            },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const data = await response.json();
        const fileContent = data.files?.['news.json']?.content;

        if (!fileContent) {
            return NextResponse.json({ error: 'News file not found in Gist' }, { status: 404 });
        }

        const parsedNews = JSON.parse(fileContent);
        return NextResponse.json(parsedNews);

    } catch (error) {
        console.error('Error fetching news ticker:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news ticker' },
            { status: 500 }
        );
    }
}
