'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/app/lib/wagmi-config';
import { useState } from 'react';

/**
 * @fileOverview App-wide providers for Wagmi (blockchain state) and React Query (data fetching).
 */

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance to handle blockchain data caching
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
