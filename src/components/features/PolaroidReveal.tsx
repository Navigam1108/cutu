'use client';

import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PolaroidRevealProps {
    imageUrl: string;
    backNote: string;
    date: string;
    onRevealComplete?: () => void;
    isAlreadyRevealed?: boolean;
}

export default function PolaroidReveal({ imageUrl, backNote, date, onRevealComplete, isAlreadyRevealed = false }: PolaroidRevealProps) {
    const [isRevealed, setIsRevealed] = useState(isAlreadyRevealed);
    const [isFlipped, setIsFlipped] = useState(false);
    const [shakeCount, setShakeCount] = useState(0);

    const x = useMotionValue(0);
    const blurValue = useTransform(x, [-100, 100], [0, 20]); // THIS LOGIC IS REVERSED IF WE WANT DRAG TO CLEAR BLUR
    // Actually, let's make it simpler: Dragging increases a "shake" counter or transparency.

    // Revised interaction: "Scratch" or "Shake" effect.
    // Implementation: Dragging the card left/right builds up "development" progress.

    const [developmentProgress, setDevelopmentProgress] = useState(isAlreadyRevealed ? 100 : 0);

    const handleDragEnd = () => {
        if (developmentProgress < 100) {
            setDevelopmentProgress(prev => Math.min(prev + 20, 100));
        }
    };

    useEffect(() => {
        if (developmentProgress >= 100 && !isRevealed) {
            setIsRevealed(true);
            if (onRevealComplete) onRevealComplete();
        }
    }, [developmentProgress, isRevealed, onRevealComplete]);

    return (
        <div className="perspective-1000 w-full max-w-sm mx-auto cursor-pointer" onClick={() => isRevealed && setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative preserve-3d transition-transform duration-700 w-full aspect-[3/4]"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* FRONT SIDE */}
                <motion.div
                    drag={!isRevealed}
                    dragConstraints={{ left: -50, right: 50, top: -20, bottom: 20 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 backface-hidden bg-white p-4 shadow-xl rotate-y-0 rounded-sm flex flex-col"
                >
                    <div className="relative flex-1 bg-black overflow-hidden mb-8">
                        {/* The Photo */}
                        <div
                            className={cn("absolute inset-0 transition-all duration-1000", isRevealed ? "filter-none" : "blur-xl grayscale opacity-50")}
                            style={{
                                filter: !isRevealed ? `blur(${20 - (developmentProgress / 5)}px) grayscale(${100 - developmentProgress}%)` : 'none'
                            }}
                        >
                            <div className="relative w-full h-full">
                                {/* Placeholder for actual image if Next Image fails without proper config/domain */}
                                <Image
                                    src={imageUrl}
                                    alt="Memory"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </div>

                        {!isRevealed && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-white/70 font-bold text-lg animate-pulse">Shake / Drag to Develop</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center font-serif text-2xl text-gray-800 rotate-1">
                        {new Date(date).toLocaleDateString()}
                    </div>
                </motion.div>

                {/* BACK SIDE */}
                <div
                    className="absolute inset-0 backface-hidden bg-orange-50 p-6 shadow-xl rotate-y-180 rounded-sm flex flex-col justify-center items-center text-center border-4 border-white"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="font-serif text-xl sm:text-2xl text-rose-800 leading-relaxed italic">
                        "{backNote}"
                    </div>
                    <div className="mt-6 text-sm text-gray-400">
                        (Click to flip back)
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
