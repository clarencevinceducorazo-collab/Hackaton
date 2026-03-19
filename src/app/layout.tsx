import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const syne = Syne({ 
  subsets: ['latin'], 
  weight: ['400', '700', '800'],
  variable: '--font-syne' 
});

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans' 
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'],
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: 'AI Onchain Bounty Board',
  description: 'Autonomous bounty platform where AI evaluates and Base pays.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} font-body antialiased bg-[#04070f] text-[#eef2ff]`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
