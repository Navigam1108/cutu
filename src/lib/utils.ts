import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getCurrentDate() {
    // Check for debug override
    if (process.env.NEXT_PUBLIC_DEBUG_DATE) {
        return new Date(process.env.NEXT_PUBLIC_DEBUG_DATE);
    }
    return new Date();
}

/**
 * Returns the "Day ID" (1-7) based on the date.
 * If before start date, returns 0.
 * If after end, returns 7 (or 8 for finished).
 */
export function getDayIdFromDate(): number {
    const now = getCurrentDate();
    const start = new Date(process.env.NEXT_PUBLIC_START_DATE || '2026-02-07');

    // Reset times for date comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    const diffTime = nowDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 0; // Day 0 (Invite)
    if (diffDays >= 7) return 7; // Max at 7 or handle 8 for "post-valentine"
    return diffDays + 1; // 0-index diff means first day is day 1
}
