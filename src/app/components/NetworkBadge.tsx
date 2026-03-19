'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { baseSepolia } from '../lib/wagmi-config';

/**
 * @fileOverview Live network status indicator.
 */

export function NetworkBadge() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 opacity-50">
      <div className="w-2 h-2 rounded-full bg-gray-500" />
      <span className="text-[11px] font-mono text-gray-400">Loading...</span>
    </div>
  );

  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;

  if (!isConnected) return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
      <div className="w-2 h-2 rounded-full bg-gray-500" />
      <span className="text-[11px] font-mono text-[#6b7a99]">Base Sepolia Testnet</span>
    </div>
  );

  if (isWrongNetwork) return (
    <button 
      onClick={() => switchChain({ chainId: baseSepolia.id })}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
    >
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="text-[11px] font-mono text-amber-500">Switch to Base Sepolia</span>
    </button>
  );

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#10b981]/30 bg-[#10b981]/10">
      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-dot-pulse" />
      <span className="text-[11px] font-mono text-[#10b981]">Base Sepolia</span>
    </div>
  );
}
