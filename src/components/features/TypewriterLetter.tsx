'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TypewriterLetterProps {
    phrases: string[]; // 7 phrases
    closingParagraph: string;
    images: string[]; // 7 image URLs corresponding to days
}

export default function TypewriterLetter({ phrases, closingParagraph, images }: TypewriterLetterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [complete, setComplete] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Combine phrases into a single narrative
    // Assuming phrases are fragments that form a sentence/paragraph.
    // We'll join them.
    const fullText = phrases.join(' ') + '\n\n' + closingParagraph;

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
                setComplete(true);
            }
        }, 50); // Typing speed

        return () => clearInterval(interval);
    }, [fullText]);

    // To make specific phrases interactive, we need to parse the displayed text or render phrases individually?
    // Since we want hover tooltips on specific "Days", it's better to render them as spans if possible.
    // But a typewriter effect works best on a string.

    // Hybrid approach: Render the phrases already fully but reveal them char-by-char?
    // Or just use a simple typing effect and AFTER completion, highlight the interactive parts.

    if (!complete) {
        return (
            <div className="font-serif text-xl md:text-2xl leading-relaxed text-rose-900 whitespace-pre-wrap">
                {displayedText}
                <span className="animate-pulse">|</span>
            </div>
        );
    }

    // Render interactive version once typing is done
    return (
        <div className="font-serif text-xl md:text-2xl leading-relaxed text-rose-900 whitespace-pre-wrap">
            {phrases.map((phrase, idx) => (
                <span
                    key={idx}
                    className="relative inline-block hover:text-rose-600 transition-colors cursor-pointer border-b-2 border-transparent hover:border-rose-300 pb-0.5"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {phrase}{' '}
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50 w-32 md:w-48 bg-white p-2 shadow-xl rotate-2 rounded-sm border-4 border-white"
                            >
                                <div className="relative aspect-[3/4] bg-stone-200">
                                    <Image
                                        src={images[idx]}
                                        alt={`Day ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-center text-[10px] mt-2 font-sans text-gray-500">Day {idx + 1}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </span>
            ))}
            <div className="mt-8 text-rose-800">
                {closingParagraph}
            </div>
        </div>
    );
}
