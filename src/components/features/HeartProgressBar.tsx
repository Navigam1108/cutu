'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface HeartProgressBarProps {
    totalDays?: number;
    completedDays: number;
}

export default function HeartProgressBar({ totalDays = 7, completedDays }: HeartProgressBarProps) {
    const [fillPercentage, setFillPercentage] = useState(0);

    useEffect(() => {
        // Calculate fill based on completed days
        const fill = (completedDays / totalDays) * 100;
        setFillPercentage(fill);
    }, [completedDays, totalDays]);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
                {/* Background Heart (Outline/Empty) */}
                <Heart
                    className="absolute inset-0 w-full h-full text-rose-200 fill-rose-100/20"
                    strokeWidth={1.5}
                />

                {/* Filled Heart with Clip Path */}
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 ease-out"
                    style={{
                        clipPath: `inset(${100 - fillPercentage}% 0 0 0)`
                    }}
                >
                    <Heart
                        className="w-full h-full text-rose-600 fill-rose-600 drop-shadow-[0_0_10px_rgba(225,29,72,0.6)]"
                        strokeWidth={0} // Filled heart doesn't need stroke usually if we want liquid effect
                    />
                    {/* Liquid Surface Effect */}
                    <motion.div
                        className="absolute top-0 left-0 w-[200%] h-4 bg-rose-400/30"
                        style={{ top: `${100 - fillPercentage}%` }}
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                </div>
            </div>
            <div className="mt-1 text-xs font-medium text-rose-700 bg-white/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                Day {completedDays} / {totalDays}
            </div>
        </div>
    );
}
