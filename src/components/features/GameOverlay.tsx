'use client';

import { useGame } from './GameContext';
import HeartProgressBar from './HeartProgressBar';
import VirtualJar from './VirtualJar';

export default function GameOverlay() {
    const { completedDaysCount, collectedItems } = useGame();

    return (
        <>
            <HeartProgressBar completedDays={completedDaysCount} />
            <VirtualJar collectedItems={collectedItems} />
        </>
    );
}
