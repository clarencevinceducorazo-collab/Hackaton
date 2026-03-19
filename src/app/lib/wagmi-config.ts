import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

/**
 * @fileOverview Wagmi configuration for Ethereum Sepolia.
 * Sepolia = free Ethereum testnet, no real money.
 */

export const config = createConfig({
  chains: [sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'AI Bounty Board' }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});

export default config;
