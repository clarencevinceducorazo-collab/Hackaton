'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

/**
 * @fileOverview Navbar indicator for Ethereum Sepolia network status.
 */

export function NetworkBadge() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 bg-[#6b7a99] rounded-full" />
        <span className="text-[#6b7a99] text-[10px] font-mono font-bold tracking-widest uppercase">Sepolia Testnet</span>
      </div>
    );
  }

  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 bg-[#6b7a99] rounded-full" />
        <span className="text-[#6b7a99] text-[10px] font-mono font-bold tracking-widest uppercase">Sepolia Testnet</span>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <button 
        onClick={() => switchChain({ chainId: sepolia.id })}
        className="flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-3 py-1.5 rounded-full hover:bg-[#f59e0b]/20 transition-colors"
      >
        <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse" />
        <span className="text-[#f59e0b] text-[10px] font-mono font-bold tracking-widest uppercase">Switch to Sepolia</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 px-3 py-1.5 rounded-full">
      <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
      <span className="text-[#10b981] text-[10px] font-mono font-bold tracking-widest uppercase">⚡ Sepolia</span>
    </div>
  );
}
