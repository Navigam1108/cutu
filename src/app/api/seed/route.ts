import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Day from '@/models/Day';

export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    await dbConnect();

    const daysData = [
        {
            dayId: 1,
            unlockDate: new Date('2026-02-07T00:00:00'),
            passcode: 'rose',
            hint: 'A classic symbol of love',
            imageUrl: '/images/day1-placeholder.jpg',
            backNote: 'Our first date...',
            phrase: 'Every journey begins with a ',
            digitalAsset: 'rose'
        },
        {
            dayId: 2,
            unlockDate: new Date('2026-02-08T00:00:00'),
            passcode: 'cinema',
            hint: 'Where we watched that movie',
            imageUrl: '/images/day2-placeholder.jpg',
            backNote: 'Remember the popcorn?',
            phrase: 'single step, but ours began with a ',
            digitalAsset: 'ticket'
        },
        {
            dayId: 3,
            unlockDate: new Date('2026-02-09T00:00:00'),
            passcode: 'beach',
            hint: 'Sand between our toes',
            imageUrl: '/images/day3-placeholder.jpg',
            backNote: 'Sunset was perfect',
            phrase: 'smile that lit up my ',
            digitalAsset: 'shell'
        },
        {
            dayId: 4,
            unlockDate: new Date('2026-02-10T00:00:00'),
            passcode: 'pizza',
            hint: 'Our favorite cheat meal',
            imageUrl: '/images/day4-placeholder.jpg',
            backNote: 'Extra cheese always',
            phrase: 'world. You are my ',
            digitalAsset: 'pizza'
        },
        {
            dayId: 5,
            unlockDate: new Date('2026-02-11T00:00:00'),
            passcode: 'coffee',
            hint: 'Morning ritual',
            imageUrl: '/images/day5-placeholder.jpg',
            backNote: 'Latte art failed',
            phrase: 'sunshine on a cloudy ',
            digitalAsset: 'cup'
        },
        {
            dayId: 6,
            unlockDate: new Date('2026-02-12T00:00:00'),
            passcode: 'music',
            hint: 'The song we danced to',
            imageUrl: '/images/day6-placeholder.jpg',
            backNote: 'Bad dancing included',
            phrase: 'day, and the melody in my ',
            digitalAsset: 'note'
        },
        {
            dayId: 7,
            unlockDate: new Date('2026-02-13T00:00:00'),
            passcode: 'star',
            hint: 'Look up at the sky',
            imageUrl: '/images/day7-placeholder.jpg',
            backNote: 'Stargazing night',
            phrase: 'heart. I love you.',
            digitalAsset: 'star'
        }
    ];

    try {
        await Day.deleteMany({}); // Clear existing
        await Day.insertMany(daysData);
        return NextResponse.json({ success: true, message: 'Seeded 7 days' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}
