import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const WIPE_DATES_FILE = join(process.cwd(), 'src/data/wipe-dates.json');
const WIPE_DATES_KEY = 'cdn:wipe-dates';

export type WipeDates = {
    nextWipeWindow: string;
    wipeCycleMonths: number;
    estimatedDaysUntilWipe: number;
    lastWipeDate: string;
    notes: string;
};

function verifyAdminToken(req: NextRequest): boolean {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return false;
    }
    return authHeader.slice(7).length > 0;
}

async function readWipeDates() {
    // Use Vercel KV in production
    if (process.env.KV_URL) {
        try {
            const { kv } = await import('@vercel/kv');
            const data = await kv.get(WIPE_DATES_KEY);
            return data || getDefaultWipeDates();
        } catch (error) {
            console.error('Error reading from Vercel KV:', error);
            // Fallback to file system
        }
    }

    // Fallback to local file system (development)
    try {
        const content = await fs.readFile(WIPE_DATES_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading wipe dates file:', error);
        return getDefaultWipeDates();
    }
}

async function writeWipeDates(data: WipeDates) {
    // Use Vercel KV in production
    if (process.env.KV_URL) {
        try {
            const { kv } = await import('@vercel/kv');
            await kv.set(WIPE_DATES_KEY, data);
            return true;
        } catch (error) {
            console.error('Error writing to Vercel KV:', error);
            // Fallback to file system
        }
    }

    // Fallback to local file system (development)
    try {
        await fs.writeFile(WIPE_DATES_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing wipe dates file:', error);
        return false;
    }
}

function getDefaultWipeDates(): WipeDates {
    return {
        nextWipeWindow: 'First Week of April 2026',
        wipeCycleMonths: 3,
        estimatedDaysUntilWipe: 90,
        lastWipeDate: '2025-12-15',
        notes: 'Subject to Change',
    };
}

export async function GET() {
    try {
        const wipeDates = await readWipeDates();
        return NextResponse.json(wipeDates);
    } catch (error) {
        console.error('Error fetching wipe dates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wipe dates' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        if (!verifyAdminToken(req)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Validate the structure
        if (
            typeof body.nextWipeWindow !== 'string' ||
            typeof body.wipeCycleMonths !== 'number' ||
            typeof body.estimatedDaysUntilWipe !== 'number' ||
            typeof body.lastWipeDate !== 'string' ||
            typeof body.notes !== 'string'
        ) {
            return NextResponse.json(
                { error: 'Invalid wipe dates format' },
                { status: 400 }
            );
        }

        const wipeDates: WipeDates = {
            nextWipeWindow: body.nextWipeWindow.trim(),
            wipeCycleMonths: body.wipeCycleMonths,
            estimatedDaysUntilWipe: body.estimatedDaysUntilWipe,
            lastWipeDate: body.lastWipeDate.trim(),
            notes: body.notes.trim(),
        };

        const success = await writeWipeDates(wipeDates);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to save wipe dates' },
                { status: 500 }
            );
        }

        return NextResponse.json(wipeDates);
    } catch (error) {
        console.error('Error updating wipe dates:', error);
        return NextResponse.json(
            { error: 'Failed to update wipe dates' },
            { status: 500 }
        );
    }
}
