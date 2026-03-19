import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

/**
 * @fileOverview Wagmi configuration for Base Sepolia.
 * SSR: true ensures compatibility with Next.js App Router.
 * Storage: uses cookieStorage to persist connection state across page reloads.
 */

export const config = createConfig({
  chains: [baseSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'AI Bounty Board' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default config;
