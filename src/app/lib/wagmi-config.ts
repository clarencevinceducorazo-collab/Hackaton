import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

/**
 * @fileOverview wagmi configuration for Base Sepolia testnet.
 * Base Sepolia = test version of Base blockchain, ETH is fake and free.
 */

export const config = createConfig({
  chains: [baseSepolia],
  ssr: true, // Server-side rendering support
  connectors: [
    injected(), // Supports MetaMask and Brave
    coinbaseWallet({ appName: 'AI Bounty Board' }),
  ],
  transports: {
    [baseSepolia.id]: http(), // Standard connection protocol
  },
});

export { baseSepolia };
