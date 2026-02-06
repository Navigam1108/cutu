'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ShoppingBag, X, Gift } from 'lucide-react'; // Using Gift ideally, or a custom Jar SVG if possible.
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface VirtualJarProps {
    collectedItems: string[]; // List of asset keys e.g., ['rose', 'ticket']
}

export default function VirtualJar({ collectedItems }: VirtualJarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Map asset keys to icons/images or component rendering
    // For now, using emojis or simple placeholders if images aren't real yet.
    const getIconForAsset = (asset: string) => {
        switch (asset) {
            case 'rose': return '🌹';
            case 'ticket': return '🎟️';
            case 'shell': return '🐚';
            case 'pizza': return '🍕';
            case 'cup': return '☕';
            case 'note': return '🎵';
            case 'star': return '⭐';
            default: return '🎁';
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-rose-200 hover:bg-rose-50 transition-colors group"
            >
                <div className="relative">
                    <Gift className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" />
                    {collectedItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                            {collectedItems.length}
                        </span>
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col border-l border-rose-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-serif font-bold text-rose-800">Your Notebook</h2>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {collectedItems.length === 0 ? (
                                    <div className="text-center text-gray-400 mt-10">
                                        <p className="text-sm">It's empty inside...</p>
                                        <p className="text-xs mt-2">Find passcodes to collect memories.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {collectedItems.map((item, idx) => (
                                            <motion.div
                                                key={`${item}-${idx}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="aspect-square rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-4xl shadow-sm hover:shadow-md transition-shadow relative group"
                                                title={item}
                                            >
                                                {getIconForAsset(item)}
                                                <span className="absolute bottom-2 text-xs text-orange-800/60 font-medium capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                                Collect all 7 to unlock the finale
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
