'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/components/features/GameContext';
import CountdownTimer from '@/components/features/CountdownTimer';
import PolaroidReveal from '@/components/features/PolaroidReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import canvasConfetti from 'canvas-confetti';

import { use } from 'react';

export default function DayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dayId = parseInt(id, 10);
    const { days, isLoading, markDayAsCompleted } = useGame();
    const router = useRouter();

    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [justUnlocked, setJustUnlocked] = useState(false);

    // We need to wait for days to load to know the status
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-400 animate-pulse">Checking records...</div>;
    }

    const day = days.find(d => d.dayId === dayId);

    // 1. Invalid Day ID
    if (!day) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100 flex-col gap-4">
                <h1 className="text-2xl font-serif text-gray-500">Day not found</h1>
                <Link href="/" className="text-rose-500 hover:underline">Return Home</Link>
            </div>
        );
    }

    // 2. Date not reached (Locked by Time)
    if (!day.isDateReached) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-rose-50 p-4">
                <div className="mb-8 p-6 bg-stone-800 rounded-2xl shadow-2xl border border-stone-700 text-center max-w-md w-full">
                    <Lock className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-serif mb-2">Not Yet...</h2>
                    <p className="text-stone-400 mb-8">This memory is still developing.</p>

                    <div className="flex justify-center">
                        <CountdownTimer targetDate={day.unlockDate} />
                    </div>
                </div>
                <Link href="/" className="flex items-center text-stone-500 hover:text-stone-300 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Timeline
                </Link>
            </div>
        );
    }

    // 3. Date reached, logic to Unlock (Passcode) OR Show Memory
    // If already completed, show memory.
    // If not completed, show passcode form.

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayId, passcode })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // SUCCESS
                markDayAsCompleted(dayId, data.phrase);
                setJustUnlocked(true);
                // Trigger generic confetti
                canvasConfetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                setError(data.error || 'Incorrect passcode');
                // Shake animation could be added here
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    if (!day.isCompleted && !justUnlocked) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 p-4">
                <Link href="/" className="absolute top-8 left-8 flex items-center text-rose-400 hover:text-rose-600 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </Link>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-rose-100"
                >
                    <div className="text-center mb-6">
                        <span className="inline-block p-3 bg-rose-100 rounded-full mb-3">
                            <Lock className="w-6 h-6 text-rose-500" />
                        </span>
                        <h1 className="text-2xl font-serif text-rose-900">Unlock Day {dayId}</h1>
                        <p className="text-gray-500 text-sm mt-2">Enter the passcode to view this memory.</p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100">
                        <p className="text-xs text-orange-600 font-bold uppercase mb-1">Hint:</p>
                        <p className="text-orange-800 italic font-serif">"{day.hint}"</p>
                    </div>

                    <form onSubmit={handleUnlock} className="flex flex-col gap-4">
                        <div>
                            <input
                                type="text"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-center text-lg tracking-widest uppercase transition-all"
                                placeholder="Passcode"
                            />
                            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isVerifying || !passcode}
                            className="w-full bg-rose-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-rose-600 active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center"
                        >
                            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock Memory'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // 4. Memory View (Unlocked)
    // Logic for flying item animation could go here on mount if justUnlocked is true.

    return (
        <div className="min-h-screen pt-24 pb-12 bg-stone-100 flex flex-col items-center">
            <Link href="/" className="absolute top-24 left-4 md:left-8 flex items-center text-stone-400 hover:text-stone-600 transition-colors z-20">
                <ArrowLeft className="w-5 h-5 mr-1" /> Timeline
            </Link>

            <div className="w-full max-w-4xl px-4 flex-1 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <PolaroidReveal
                        imageUrl={day.imageUrl}
                        backNote={day.imageUrl.includes('placeholder') ? 'Placeholder Note: Remember this special day?' : 'Default Note'} // In real app, backNote comes from API or context if we add it to status
                        // Wait, /api/status does NOT return backNote for security? 
                        // I only return it in /api/verify.
                        // So if I refreshed the page, I don't have backNote in `days` context!
                        // I need to fetch the day details specifically if unlocked? 
                        // Or I should allow /api/status to return backNote if it's NOT secret? 
                        // Actually, `backNote` is usually safe. Passcode is the secret.
                        // Let's assume for now I should update `api/status` to return backNote.
                        // Or simpler: Just render a generic note or fetch it.
                        // FIX: I will update the Context/API to return `backNote`.
                        date={day.unlockDate}
                        isAlreadyRevealed={!justUnlocked}
                    />
                </motion.div>

                <div className="mt-12 text-center max-w-md">
                    <p className="text-stone-400 text-sm italic mb-4">You collected a new item!</p>
                    <div className="text-6xl animate-bounce">
                        {/* Map digital asset to emoji/icon */}
                        {day.digitalAsset === 'rose' && '🌹'}
                        {day.digitalAsset === 'ticket' && '🎟️'}
                        {day.digitalAsset === 'shell' && '🐚'}
                        {day.digitalAsset === 'pizza' && '🍕'}
                        {day.digitalAsset === 'cup' && '☕'}
                        {day.digitalAsset === 'note' && '🎵'}
                        {day.digitalAsset === 'star' && '⭐'}
                    </div>
                </div>
            </div>
        </div>
    );
}
