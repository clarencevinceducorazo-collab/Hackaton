'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/app/lib/wagmi-config';
import { useState } from 'react';

/**
 * @fileOverview React context provider wrapper.
 */

export function Providers({ children }: { children: React.ReactNode }) {
  // Prevent re-creating QueryClient on every render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
