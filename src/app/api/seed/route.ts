import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Day from '@/models/Day';


export async function GET() {
    // allow in production for now to seed
    // if (process.env.NODE_ENV === 'production') {
    //     return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    // }

    await dbConnect();

    const daysData = [
        {
            dayId: 1,
            unlockDate: new Date('2026-02-07T00:00:00'),
            passcode: 'pns',
            hint: 'c se cutu, c se cr (3 letters)',
            imageUrl: '/images/day1-placeholder.png',
            backNote: 'Where it all began',
            phrase: 'Everything started with a simple glance, but little did I know that \'PNS\' would lead me to my absolute favorite person.',
            digitalAsset: 'rose'
        },
        {
            dayId: 2,
            unlockDate: new Date('2026-02-08T00:00:00'),
            passcode: 'pink',
            hint: 'the color of ur dress when i first saw u as my gf',
            imageUrl: '/images/day2-placeholder.png',
            backNote: 'I first saw u in this color',
            phrase: 'I can still see you clearly in that pink dress—the moment reality shifted and you weren\'t just a crush, but my everything.',
            digitalAsset: 'ticket'
        },
        {
            dayId: 3,
            unlockDate: new Date('2026-02-09T00:00:00'),
            passcode: 'amul',
            hint: 'where i called u for night walks',
            imageUrl: '/images/day3-placeholder.png',
            backNote: 'location of mini-date from me',
            phrase: 'Those night walks to Amul weren\'t just about the strolls; they were about the quiet way our worlds started to sync under the stars. ',
            digitalAsset: 'shell'
        },
        {
            dayId: 4,
            unlockDate: new Date('2026-02-10T00:00:00'),
            passcode: 'pasta',
            hint: 'ur favorite cheat meal',
            imageUrl: '/images/day4-placeholder.png',
            backNote: 'ur favorite meal',
            phrase: 'Whether I\'m cooking your favorite pasta or a new recipe, my favorite \'job\' will always be serving my Queen.',
            digitalAsset: 'pizza'
        },
        {
            dayId: 5,
            unlockDate: new Date('2026-02-11T00:00:00'),
            passcode: 'bk',
            hint: 'our first real date cafe (2lettters)',
            imageUrl: '/images/day5-placeholder.png',
            backNote: 'burger king',
            phrase: 'From the long hours we spend studying together to our first real date at BK, you’ve turned ordinary places into extraordinary memories. ',
            digitalAsset: 'cup'
        },
        {
            dayId: 6,
            unlockDate: new Date('2026-02-12T00:00:00'),
            passcode: 'cutepoint',
            hint: 'our first hug was at this point',
            imageUrl: '/images/day6-placeholder.png',
            backNote: 'Bad dancing included',
            phrase: 'That first hug at Cutepoint changed everything; it was the moment I promised to always give you the princess treatment you deserve.',
            digitalAsset: 'note'
        },
        {
            dayId: 7,
            unlockDate: new Date('2026-02-13T00:00:00'),
            passcode: '2states',
            hint: 'our first kiss (2)',
            imageUrl: '/images/day7-placeholder.png',
            backNote: 'Stargazing night',
            phrase: 'A kiss that felt like \'2 States\' coming together—one heart, one future, and a love that is truly written in the stars.',
            digitalAsset: 'star'
        }
    ];


    // Construct Blob URLs from environment variable
    const blobBaseUrl = process.env.BLOB_BASE_URL;
    if (!blobBaseUrl) {
        return NextResponse.json({ error: 'BLOB_BASE_URL env var not set' }, { status: 500 });
    }

    // Update image URLs
    for (const day of daysData) {
        day.imageUrl = `${blobBaseUrl}/day${day.dayId}.jpeg`;
    }

    try {
        await Day.deleteMany({}); // Clear existing
        await Day.insertMany(daysData);
        return NextResponse.json({ success: true, message: 'Seeded 7 days with Blob URLs' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}
