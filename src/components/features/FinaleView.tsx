'use client';

import { useGame } from '@/components/features/GameContext';
import TypewriterLetter from '@/components/features/TypewriterLetter';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import canvasConfetti from 'canvas-confetti';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FinaleView() {
    const { collectedPhrases, days } = useGame();
    const [showLetter, setShowLetter] = useState(false);
    const [exploded, setExploded] = useState(false);

    // Reconstruct the ordered phrases
    const phrases = Array.from({ length: 7 }, (_, i) => collectedPhrases[i + 1] || '...');
    const closingParagraph = "Happy Valentine's Day! You solved every puzzle, just like you solve every bad day of mine. I love you.";
    const images = days.map(d => d.imageUrl); // Ordered by ID from context usually

    useEffect(() => {
        // Trigger explosion on mount
        const timer = setTimeout(() => {
            setExploded(true);
            canvasConfetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#e11d48', '#fb7185', '#f43f5e']
            });

            // Delay letter appearance
            setTimeout(() => setShowLetter(true), 1500);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!showLetter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rose-50 overflow-hidden relative">
                <motion.div
                    initial={{ scale: 1 }}
                    animate={exploded ? { scale: [1, 1.2, 0], opacity: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-9xl"
                >
                    🎁
                </motion.div>
                {exploded && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Items floating */}
                        {days.map((d, i) => (
                            <motion.div
                                key={d.dayId}
                                initial={{ opacity: 0, x: 0, y: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    x: Math.random() * 400 - 200,
                                    y: Math.random() * -400 - 50,
                                    rotate: Math.random() * 360
                                }}
                                transition={{ duration: 3, delay: 0.2 }}
                                className="absolute text-4xl"
                            >
                                {/* Emulate asset */}
                                {d.digitalAsset === 'rose' ? '🌹' : '✨'}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8 flex flex-col items-center">
            <Link href="/" className="self-start text-stone-400 hover:text-stone-600 mb-8 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Timeline
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full bg-white p-8 md:p-16 rounded-sm shadow-xl border border-stone-100 min-h-[60vh] relative"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200" />
                <TypewriterLetter
                    phrases={phrases}
                    closingParagraph={closingParagraph}
                    images={images}
                />
            </motion.div>
        </div>
    );
}
