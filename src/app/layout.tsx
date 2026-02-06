import type { Metadata } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { GameProvider } from '@/components/features/GameContext';
import GameOverlay from '../components/features/GameOverlay';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Valentine's Adventure",
  description: "A journey through our memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, dancingScript.variable, "font-sans antialiased bg-stone-50 text-stone-900 min-h-screen")}>
        <GameProvider>
          <GameOverlay />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
