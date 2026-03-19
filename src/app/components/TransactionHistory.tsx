import React from 'react';
import { Transaction } from '../types';
import { ExternalLink, Receipt } from 'lucide-react';

/**
 * @fileOverview Simple list of completed payouts for the session.
 */

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) return null;

  return (
    <div className="mt-20 max-w-[800px] mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
        <h3 className="text-[10px] font-mono font-black text-[#6b7a99] uppercase tracking-[0.2em]">Recent Payouts</h3>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </div>

      <div className="space-y-3">
        {transactions.map(tx => (
          <div 
            key={tx.txHash} 
            className="bg-[#0d1424] border border-[#10b981]/20 rounded-xl p-4 flex items-center justify-between gap-4 group hover:border-[#10b981]/40 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#eef2ff] font-bold text-sm truncate max-w-[200px] sm:max-w-none">{tx.bountyTitle}</span>
                <span className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-[9px] font-mono font-bold rounded border border-[#10b981]/20 uppercase">Confirmed</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#6b7a99] font-mono">
                <span className="text-[#00d4ff] font-bold">0.001 ETH</span>
                <span className="opacity-30">•</span>
                <span>Just now</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <code className="hidden sm:block text-[#00d4ff] text-[11px] font-mono bg-black/40 px-2 py-1 rounded">
                {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
              </code>
              <a 
                href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
