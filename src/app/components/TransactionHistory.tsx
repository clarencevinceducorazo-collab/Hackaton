'use client';

import React from 'react';
import { TxEntry } from '../types/transaction';

/**
 * @fileOverview Displays a session-based list of completed blockchain payouts.
 * Basescan = blockchain explorer — like a receipt viewer for txs.
 */

interface TransactionHistoryProps {
  transactions: TxEntry[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="mt-20 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(59,130,246,0.15)]" />
        <h3 className="text-xs font-black text-[#6b7a99] uppercase tracking-[0.2em]">Session Payouts</h3>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(59,130,246,0.15)]" />
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div 
            key={tx.txHash} 
            className="bg-[#0d1424] border border-[rgba(16,185,129,0.2)] rounded-xl p-4 flex items-center justify-between gap-4 group hover:border-[#10b981]/40 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#eef2ff] font-bold text-sm truncate">{tx.bountyTitle}</span>
                <span className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-[9px] font-bold rounded border border-[#10b981]/20">CONFIRMED</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#6b7a99] font-mono">
                <span>0.001 ETH (= {tx.amount} USDC sim)</span>
                <span>•</span>
                <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <code className="hidden sm:block text-[#00d4ff] text-[11px] font-mono bg-[#00d4ff]/5 px-2 py-1 rounded">
                {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
              </code>
              <a
                href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
                title="View on Basescan"
              >
                ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
