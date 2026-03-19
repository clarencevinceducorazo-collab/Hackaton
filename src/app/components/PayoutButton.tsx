'use client';

import React, { useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

/**
 * @fileOverview Triggers an ETH payout on Sepolia.
 */

interface PayoutButtonProps {
  recipientAddress: string;
  rewardAmount: number;
  bountyId: string;
  onPayoutComplete: (txHash: string) => void;
}

export function PayoutButton({ recipientAddress, rewardAmount, onPayoutComplete }: PayoutButtonProps) {
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && hash) {
      onPayoutComplete(hash);
    }
  }, [isConfirmed, hash, onPayoutComplete]);

  const handlePayout = () => {
    sendTransaction({
      to: recipientAddress as `0x${string}`,
      value: parseEther(rewardAmount.toString()),
    });
  };

  if (isConfirmed && hash) {
    return (
      <div className="w-full bg-[#10b981]/5 border border-[#10b981]/30 rounded-xl p-6 mt-4 animate-fade-in">
        <h4 className="text-[#10b981] font-mono font-bold text-xs tracking-widest mb-4">✓ PAYOUT CONFIRMED</h4>
        <div className="space-y-3">
          <div>
            <span className="block text-[10px] text-[#6b7a99] uppercase font-bold mb-1">Transaction Hash:</span>
            <code className="text-[#00d4ff] font-mono text-sm block truncate">
              {hash.slice(0, 10)}...{hash.slice(-6)}
            </code>
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#3b82f6] text-xs font-bold hover:underline"
          >
            View on Etherscan →
          </a>
          <p className="text-[11px] text-[#6b7a99]">
            {rewardAmount} ETH sent to {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#ef4444]/5 border border-[#ef4444]/30 rounded-xl p-6 mt-4">
        <p className="text-[#ef4444] text-xs font-bold mb-4">Payout Failed: {error.message.split('\n')[0]}</p>
        <button
          onClick={handlePayout}
          className="bg-[#ef4444] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#ef4444]/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <button
        onClick={handlePayout}
        disabled={isPending || isConfirming}
        className="w-full bg-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] text-[#050810] font-black text-sm py-4 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        {(isPending || isConfirming) ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#050810] border-t-transparent rounded-full animate-spin" />
            <span>{isConfirming ? 'Confirming on Sepolia...' : 'Sending...'}</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ⚡ Claim {rewardAmount} ETH Reward
          </span>
        )}
      </button>
      <p className="text-center text-[10px] text-[#6b7a99] mt-3 font-mono tracking-wider uppercase">
        Payout via Ethereum Sepolia testnet
      </p>
    </div>
  );
}
