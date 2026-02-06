import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Day from '@/models/Day';
import { getDayIdFromDate } from '@/lib/utils';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { dayId, passcode } = await req.json();

        if (!dayId || !passcode) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const currentDayId = getDayIdFromDate();
        if (dayId > currentDayId) {
            return NextResponse.json({ error: 'This day is not yet available!' }, { status: 403 });
        }

        const day = await Day.findOne({ dayId: dayId });
        if (!day) {
            return NextResponse.json({ error: 'Day not found' }, { status: 404 });
        }

        // Case-insensitive comparison
        if (day.passcode.toLowerCase().trim() === passcode.toLowerCase().trim()) {
            return NextResponse.json({
                success: true,
                phrase: day.phrase,
                imageUrl: day.imageUrl,
                backNote: day.backNote,
                digitalAsset: day.digitalAsset
            });
        } else {
            return NextResponse.json({ error: 'Incorrect passcode' }, { status: 401 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
