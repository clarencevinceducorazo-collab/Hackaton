import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Bounty.AI — Autonomous Onchain Bounties',
  description: 'An autonomous bounty platform where AI evaluates submissions and Base blockchain handles instant USDC payouts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#050810] text-[#eef2ff]" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
