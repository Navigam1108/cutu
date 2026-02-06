'use client';

import FinaleView from '@/components/features/FinaleView';
import { useGame } from '@/components/features/GameContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FinalePage() {
    const { completedDaysCount, isLoading } = useGame();
    const router = useRouter();

    // Protect the route
    useEffect(() => {
        if (!isLoading && completedDaysCount < 7) {
            router.replace('/');
        }
    }, [completedDaysCount, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-400">Loading...</div>;
    }

    if (completedDaysCount < 7) {
        return null; // Will redirect
    }

    return <FinaleView />;
}
