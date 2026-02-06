'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RunawayButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function RunawayButton({ children, className, onClick }: RunawayButtonProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleHover = () => {
        // Generate random position offset
        // Ensure it stays somewhat on screen if possible, or just moves significantly
        const maxX = window.innerWidth / 2 - 100;
        const maxY = window.innerHeight / 2 - 50;

        // Random direction
        const randomX = Math.random() * (Math.random() > 0.5 ? maxX : -maxX);
        const randomY = Math.random() * (Math.random() > 0.5 ? maxY : -maxY);

        setPosition({ x: randomX, y: randomY });
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseEnter={handleHover}
            // Mobile touch support - move on touch start if not clicked? 
            // Or just let mobile users click it? The prompt implies "mouse hovers".
            // Let's make it move on tap too if we want to be mean, but usually tap = click.
            // We'll leave tap as click for accessibility or frustration prevention? 
            // Prompt says "No button MUST be unclickable".
            onTouchStart={handleHover}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn("relative", className)}
            onClick={onClick} // Should technically be unclickable due to moving
        >
            {children}
        </motion.button>
    );
}
