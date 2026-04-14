import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/chatbot';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const adminToken = process.env.CHATBOT_ANALYTICS_TOKEN;

  if (!adminToken) {
    return NextResponse.json({ error: 'Analytics token is not configured.' }, { status: 503 });
  }

  const bearer = request.headers.get('authorization')?.replace('Bearer ', '').trim();
  if (!bearer || bearer !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(getAnalyticsSummary());
}
