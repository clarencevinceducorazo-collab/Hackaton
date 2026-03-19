'use client';

import React, { useState, useEffect } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { baseSepolia } from '../lib/wagmi-config';
import { CheckCircle2, Loader2, Zap } from 'lucide-react';

/**
 * @fileOverview Blockchain transaction trigger for payouts.
 */

interface PayoutButtonProps {
  recipientAddress: string;
  rewardAmount: number;
  bountyId: string;
  bountyTitle: string;
  onPayoutComplete: (txHash: string) => void;
}

export function PayoutButton({ recipientAddress, rewardAmount, bountyId, bountyTitle, onPayoutComplete }: PayoutButtonProps) {
  const [txState, setTxState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  const handlePayout = () => {
    setTxState('sending');
    sendTransaction({
      to: recipientAddress as `0x${string}`,
      // Simulated: 0.001 ETH per reward unit
      value: parseEther('0.001'),
      chainId: baseSepolia.id
    });
  };

  useEffect(() => {
    if (hash) {
      setTxState('success');
      onPayoutComplete(hash);
    }
    if (error) {
      setTxState('error');
    }
  }, [hash, error, onPayoutComplete]);

  if (txState === 'success') return (
    <div className="w-full bg-[#10b981]/10 border border-[#10b981]/40 rounded-xl p-6 mt-4 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle2 className="text-[#10b981]" size={20} />
        <h4 className="text-[#10b981] font-mono font-bold text-sm uppercase tracking-widest">Payout Confirmed</h4>
      </div>
      <div className="space-y-3">
        <div>
          <span className="block text-[10px] text-[#6b7a99] uppercase font-bold font-mono mb-1">Transaction Hash</span>
          <code className="text-[#00d4ff] font-mono text-xs block truncate bg-black/40 p-2 rounded" title={hash}>
            {hash?.slice(0, 12)}...{hash?.slice(-10)}
          </code>
        </div>
        <div className="flex justify-between items-center">
          <a 
            href={`https://sepolia.etherscan.io/tx/${hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#3b82f6] text-[11px] font-bold hover:underline"
          >
            View on Etherscan →
          </a>
          <span className="text-[10px] text-[#6b7a99] italic font-body">Confirmed just now</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full mt-4">
      {txState === 'error' && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-body leading-relaxed">
          {error?.message.split('\n')[0] || 'Transaction failed. Check your wallet balance.'}
        </div>
      )}
      
      <button
        onClick={handlePayout}
        disabled={isPending || txState === 'sending'}
        className="w-full bg-[#00d4ff] hover:bg-[#00e5ff] text-[#04070f] font-black text-sm py-4 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden animate-pulse-glow"
      >
        {isPending || txState === 'sending' ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Confirming on Base...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2 uppercase tracking-widest">
            <Zap size={18} fill="currentColor" />
            Claim {rewardAmount} ETH Reward
          </span>
        )}
      </button>
      <p className="text-center text-[9px] text-[#6b7a99] mt-3 font-mono tracking-wider uppercase">
        Sends 0.001 testnet ETH as simulation · Base Sepolia
      </p>
    </div>
  );
}
