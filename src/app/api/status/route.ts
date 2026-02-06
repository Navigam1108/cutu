import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Day from '@/models/Day';
import { getCurrentDate, getDayIdFromDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    const serverDate = getCurrentDate();
    const currentDayId = getDayIdFromDate();

    try {
        // For now, simple logic: all days <= currentDayId are potentially unlockable.
        // In a real multi-user app, we'd check user progress.
        // Here, we just return the server status and let the client handle progress check.

        // Fetch all days metadata (exclude secrets like passcode if needed, but here we can secure it)
        const days = await Day.find({}).sort({ dayId: 1 }).lean();

        // Sanitize data - don't send passcodes to client!
        const sanitizedDays = days.map(day => ({
            dayId: day.dayId,
            unlockDate: day.unlockDate,
            imageUrl: day.imageUrl,
            backNote: day.backNote,
            // Actually, polaroid needs to be hidden until unlocked.
            // But we need to know IF it's unlockable (date reached).
            isDateReached: day.dayId <= currentDayId,
            hint: day.hint,
            digitalAsset: day.digitalAsset,
            isCompleted: false // Client will fill this from localStorage/User check
        }));

        return NextResponse.json({
            serverDate: serverDate.toISOString(),
            currentDayId,
            days: sanitizedDays
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
}
