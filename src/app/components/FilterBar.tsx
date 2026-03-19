'use client';

import React from 'react';

/**
 * @fileOverview Navigation pills for bounty board filtering.
 */

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: any) => void;
  counts: { all: number; open: number; inReview: number; paid: number };
}

export function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  const filters = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'open', label: 'Open', count: counts.open },
    { id: 'in_review', label: 'In Review', count: counts.inReview },
    { id: 'paid', label: 'Paid', count: counts.paid },
  ];

  const getStyle = (id: string) => {
    if (activeFilter === id) {
      switch (id) {
        case 'open': return 'bg-[#10b981] text-white border-[#10b981]';
        case 'in_review': return 'bg-[#f59e0b] text-white border-[#f59e0b]';
        case 'paid': return 'bg-[#3b82f6] text-white border-[#3b82f6]';
        default: return 'bg-[#00d4ff] text-[#04070f] border-[#00d4ff]';
      }
    }
    return 'text-[#6b7a99] border-white/10 hover:border-white/30';
  };

  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full border text-[12px] font-bold font-mono transition-all duration-200 ${getStyle(f.id)}`}
        >
          {f.label}
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === f.id ? 'bg-black/20' : 'bg-white/5 text-[#6b7a99]'}`}>
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
}
