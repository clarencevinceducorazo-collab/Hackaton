'use client';

import React, { useState } from 'react';
import { Bounty } from '../types';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, ChevronUp, Clock, Code2 } from 'lucide-react';

/**
 * @fileOverview Dashboard card for a single bounty.
 */

interface BountyCardProps {
  bounty: Bounty;
  onSubmitWork: (bounty: Bounty) => void;
}

export function BountyCard({ bounty, onSubmitWork }: BountyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.15)] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,212,255,0.35)] group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.25)] px-3 py-1 rounded-md">
          <span className="text-[#00d4ff] font-mono font-bold text-sm">{bounty.reward} ETH</span>
        </div>
        <StatusBadge status={bounty.status} />
      </div>

      <h3 className="text-xl font-extrabold font-display leading-tight mb-2 text-[#eef2ff] group-hover:text-[#00d4ff] transition-colors">
        {bounty.title}
      </h3>
      
      <p className="text-[#94a3b8] text-sm line-clamp-2 mb-4 font-body">
        {bounty.description}
      </p>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6b7a99] hover:text-[#eef2ff] transition-colors mb-4"
      >
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isExpanded ? 'Hide requirements' : 'View requirements'}
      </button>

      {isExpanded && (
        <div className="mb-6 p-4 rounded-lg bg-black/20 border border-white/5 animate-fadeIn">
          <ul className="space-y-2">
            {bounty.requirements.split('\n').map((req, i) => (
              <li key={i} className="text-xs text-[#c7d2fe] flex gap-2">
                <span className="text-[#00d4ff]">•</span> {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-[#6b7a99] font-mono">
          <Clock size={12} />
          {timeAgo(bounty.createdAt)}
        </div>

        {bounty.status === 'OPEN' || bounty.status === 'REJECTED' ? (
          <button 
            onClick={() => onSubmitWork(bounty)}
            className="bg-[#3b82f6] hover:bg-[#00d4ff] text-white font-bold text-xs py-2 px-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/10"
          >
            {bounty.status === 'REJECTED' ? 'Resubmit →' : 'Submit Work →'}
          </button>
        ) : bounty.status === 'IN_REVIEW' ? (
          <span className="text-[#f59e0b] font-bold text-[11px] uppercase tracking-wider italic">Under Review...</span>
        ) : (
          <span className="text-[#10b981] font-bold text-[11px] uppercase tracking-wider">Completed ✓</span>
        )}
      </div>
    </div>
  );
}
