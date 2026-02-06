'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/components/features/GameContext';
import RunawayButton from '@/components/features/RunawayButton';
import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { Heart, Lock, Check } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isLoading, days, completedDaysCount } = useGame();
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedInvite = localStorage.getItem('valentine_invite_accepted');
    if (storedInvite) {
      setInviteAccepted(true);
    }
  }, []);

  const handleAcceptInvite = () => {
    localStorage.setItem('valentine_invite_accepted', 'true');
    setInviteAccepted(true);
    setShowConfetti(true);
    canvasConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#e11d48', '#fff1f2']
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-400 animate-pulse">Loading adventure...</div>;
  }

  // --- DAY 0: INVITE VIEW ---
  if (!inviteAccepted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-100 to-orange-50 overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-rose-200 relative"
        >
          <div className="absolute -top-6 -left-6 text-6xl rotate-[-15deg]">💌</div>

          <h1 className="font-serif text-4xl md:text-5xl text-rose-600 mb-6">Will you be my Valentine?</h1>
          <p className="text-gray-500 mb-8 font-sans">I've prepared a little adventure for us...</p>

          <div className="flex flex-col gap-4 items-center justify-center relative h-32">
            <button
              onClick={handleAcceptInvite}
              className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all w-48 z-10"
            >
              Yes, I will! 💖
            </button>

            <div className="absolute top-16 w-full flex justify-center">
              <RunawayButton className="bg-gray-300 text-gray-500 px-8 py-3 rounded-full font-bold text-lg cursor-not-allowed">
                No 😢
              </RunawayButton>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (AFTER ACCEPT) ---
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-4xl md:text-5xl text-rose-800 mb-2"
          >
            Our Valentine's Week
          </motion.h1>
          <p className="text-stone-500">Log in daily to unlock a memory.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {days.map((day) => (
            <Link
              key={day.dayId}
              href={day.dayId > 7 ? "#" : `/day/${day.dayId}`}
              className={day.dayId > 7 ? "pointer-events-none" : ""}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className={`
                   relative aspect-[3/4] rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center border transition-colors
                   ${day.isCompleted
                    ? "bg-white border-rose-200"
                    : day.isDateReached
                      ? "bg-white border-rose-200 hover:border-rose-400 cursor-pointer"
                      : "bg-gray-100 border-gray-200 cursor-not-allowed grayscale"}
                 `}
              >
                {day.isCompleted ? (
                  <>
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                      <Check className="w-8 h-8 text-rose-500" />
                    </div>
                    <span className="font-serif text-xl text-rose-600">Day {day.dayId}</span>
                    <span className="text-xs text-green-500 font-bold mt-1">Completed</span>
                  </>
                ) : day.isDateReached ? (
                  <>
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-rose-100 transition-colors">
                      <Heart className="w-8 h-8 text-rose-400 animate-pulse" />
                    </div>
                    <span className="font-serif text-xl text-stone-700">Day {day.dayId}</span>
                    <span className="text-xs text-rose-500 font-bold mt-1">Unlock Now</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 text-gray-400 mb-3" />
                    <span className="font-serif text-xl text-gray-400">Day {day.dayId}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {/* Formatting unlock date */}
                      {new Date(day.unlockDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </>
                )}
              </motion.div>
            </Link>
          ))}

          {/* Finale Card */}
          <Link href={completedDaysCount === 7 ? "/finale" : "#"} className="contents">
            <div className={`
                relative aspect-[3/4] rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center border bg-gradient-to-br from-rose-500 to-pink-600 text-white
                ${completedDaysCount === 7 ? "cursor-pointer hover:shadow-xl hover:scale-105 transition-all" : "opacity-50 grayscale cursor-not-allowed"}
             `}>
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="font-serif text-2xl font-bold">Finale</h3>
              <p className="text-xs text-rose-100 mt-1">Feb 14</p>
              {completedDaysCount < 7 && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                  <Lock className="w-8 h-8" />
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {process.env.NEXT_PUBLIC_DEBUG_DATE === '2026-02-14' && (
        <footer className="mt-16 text-center text-stone-400 pb-8">
          <p className="font-serif italic mb-4">Made with all my love ❤️</p>
          <button
            onClick={() => {
              if (window.confirm('Reset all progress and return to the start?')) {
                localStorage.removeItem('valentine_progress');
                localStorage.removeItem('valentine_phrases');
                localStorage.removeItem('valentine_invite_accepted');
                window.location.reload();
              }
            }}
            className="text-xs text-stone-300 hover:text-stone-500 underline transition-colors"
          >
            Reset All Progress
          </button>
        </footer>
      )}

    </div>
  );
}
