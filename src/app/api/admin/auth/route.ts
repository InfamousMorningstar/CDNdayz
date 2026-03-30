import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Get admin password from environment variable
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { error: 'Admin not configured' },
                { status: 500 }
            );
        }

        if (password !== adminPassword) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Generate a simple token (in production, use a proper JWT or session)
        const token = Buffer.from(`${Date.now()}:${Math.random()}`).toString('base64');

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 400 }
        );
    }
}
