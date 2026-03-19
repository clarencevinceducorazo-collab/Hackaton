'use client';
import React from 'react';
import { Bounty } from '../types/bounty';
import { User } from 'lucide-react';

interface BountyCardProps {
  bounty: Bounty;
  onSubmit: (bounty: Bounty) => void;
}

export function BountyCard({ bounty, onSubmit }: BountyCardProps) {
  const statusStyles = {
    OPEN: 'bg-[rgba(16,185,129,0.1)] border-[#10b981] text-[#10b981]',
    IN_REVIEW: 'bg-[rgba(245,158,11,0.1)] border-[#f59e0b] text-[#f59e0b]',
    PAID: 'bg-[rgba(59,130,246,0.1)] border-[#3b82f6] text-[#3b82f6]',
  };

  const date = new Date(bounty.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.15)] rounded-xl p-6 transition-all duration-300 hover:border-[rgba(0,212,255,0.35)] hover:-translate-y-1 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${statusStyles[bounty.status]}`}>
          {bounty.status === 'PAID' ? 'Completed ✓' : bounty.status.replace('_', ' ')}
        </span>
        <span className="text-[#6b7a99] text-[11px] font-mono">{date}</span>
      </div>

      <h3 className="text-xl font-extrabold text-[#eef2ff] mb-2 leading-tight group-hover:text-[#00d4ff] transition-colors">
        {bounty.title}
      </h3>
      
      <p className="text-[#94a3b8] text-sm line-clamp-2 mb-4 leading-relaxed">
        {bounty.description}
      </p>

      {/* Creator Info */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-white/5 border border-white/5">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#a855f7] to-[#00d4ff] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-[0_0_10px_rgba(0,212,255,0.3)]">
          {bounty.creatorAddress ? bounty.creatorAddress.slice(2, 3).toUpperCase() : <User size={12} />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest leading-none mb-0.5">Posted By</span>
          <span className="text-[11px] text-[#c7d2fe] font-mono truncate">
            {bounty.creatorAddress ? truncateAddress(bounty.creatorAddress) : 'Anonymous'}
          </span>
        </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-6">
        <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest block mb-1">Requirements:</span>
        <p className="text-[12px] text-[#c7d2fe] line-clamp-2 italic leading-snug">
          "{bounty.requirements}"
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.3)] px-3 py-1.5 rounded-md">
          <span className="text-[#00d4ff] font-mono font-bold text-sm">
            {bounty.reward} ETH
          </span>
        </div>

        {bounty.status === 'OPEN' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSubmit(bounty);
            }}
            className="bg-[#3b82f6] hover:bg-[#00d4ff] text-white font-bold text-xs py-2 px-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/10"
          >
            Submit Work
          </button>
        )}
        {bounty.status === 'IN_REVIEW' && (
          <button disabled className="bg-[#f59e0b]/20 text-[#f59e0b] font-bold text-xs py-2 px-4 rounded-lg cursor-not-allowed border border-[#f59e0b]/30">
            Under Review...
          </button>
        )}
        {bounty.status === 'PAID' && (
          <button disabled className="bg-[#10b981]/20 text-[#10b981] font-bold text-xs py-2 px-4 rounded-lg cursor-not-allowed border border-[#10b981]/30">
            Completed ✓
          </button>
        )}
      </div>
    </div>
  );
}
