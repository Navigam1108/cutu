'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(interval);
                // Reload page or trigger refresh?
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col">
                    <div className="bg-rose-500 text-white text-3xl font-bold w-16 h-16 rounded-lg flex items-center justify-center shadow-md">
                        {value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs text-rose-300 uppercase mt-1">{unit}</span>
                </div>
            ))}
        </div>
    );
}
