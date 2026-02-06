'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type DayStatus = {
    dayId: number;
    unlockDate: string;
    isDateReached: boolean;
    imageUrl: string;
    hint: string;
    digitalAsset: string;
    backNote: string;
    isCompleted: boolean;
};

interface GameContextType {
    days: DayStatus[];
    completedDaysCount: number;
    collectedItems: string[];
    collectedPhrases: Record<number, string>; // Map dayId -> phrase
    refreshStatus: () => Promise<void>;
    markDayAsCompleted: (dayId: number, phrase: string) => void;
    isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [days, setDays] = useState<DayStatus[]>([]);
    const [collectedPhrases, setCollectedPhrases] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();

            // Merge with local storage for "isCompleted"
            const localProgress = JSON.parse(localStorage.getItem('valentine_progress') || '{}');
            const localPhrases = JSON.parse(localStorage.getItem('valentine_phrases') || '{}');

            setCollectedPhrases(localPhrases);

            const mergedDays = data.days.map((d: any) => ({
                ...d,
                isCompleted: !!localProgress[d.dayId]
            }));

            setDays(mergedDays);
        } catch (error) {
            console.error('Failed to fetch status', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const markDayAsCompleted = (dayId: number, phrase: string) => {
        // Update local storage
        const localProgress = JSON.parse(localStorage.getItem('valentine_progress') || '{}');
        localProgress[dayId] = true;
        localStorage.setItem('valentine_progress', JSON.stringify(localProgress));

        // Update phrases
        const localPhrases = JSON.parse(localStorage.getItem('valentine_phrases') || '{}');
        localPhrases[dayId] = phrase;
        localStorage.setItem('valentine_phrases', JSON.stringify(localPhrases));
        setCollectedPhrases(localPhrases);

        // Update state locally to reflect immediately
        setDays(prev => prev.map(d => d.dayId === dayId ? { ...d, isCompleted: true } : d));
    };

    const completedDaysCount = days.filter(d => d.isCompleted).length;
    // Collect digital assets for COMPLETED days only
    const collectedItems = days.filter(d => d.isCompleted).map(d => d.digitalAsset);

    return (
        <GameContext.Provider value={{ days, completedDaysCount, collectedItems, collectedPhrases, refreshStatus: fetchStatus, markDayAsCompleted, isLoading }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
