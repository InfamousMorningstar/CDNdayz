import { NextResponse } from 'next/server';
import { getOfficialDayZNews } from '@/lib/dayz-news';

// Cache duration for the API route
export const revalidate = 900; // 15 minutes

export async function GET() {
  try {
    const news = await getOfficialDayZNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
