import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

/**
 * @fileOverview Wagmi configuration for Base Sepolia.
 * Base Sepolia = free testnet version of Base blockchain, fake ETH, free.
 */

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    // Injected connector covers MetaMask, Rabby, and other browser extensions
    injected(),
    // Native Coinbase Wallet support
    coinbaseWallet({ appName: 'AI Bounty Board' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default config;
