'use client';
import React from 'react';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    ALL: number;
    OPEN: number;
    IN_REVIEW: number;
    PAID: number;
  };
}

export function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  const filters = [
    { id: 'ALL', label: 'All' },
    { id: 'OPEN', label: 'Open' },
    { id: 'IN_REVIEW', label: 'In Review' },
    { id: 'PAID', label: 'Paid' },
  ];

  const getActiveStyles = (id: string) => {
    if (activeFilter !== id) return 'text-[#6b7a99] hover:text-[#eef2ff] border-transparent';
    
    switch (id) {
      case 'OPEN': return 'bg-[#10b981] text-white border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'IN_REVIEW': return 'bg-[#f59e0b] text-white border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'PAID': return 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      default: return 'bg-[#00d4ff] text-[#050810] border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]';
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 ${getActiveStyles(f.id)}`}
        >
          {f.label}
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeFilter === f.id ? 'bg-black/20' : 'bg-white/5'}`}>
            {counts[f.id as keyof typeof counts]}
          </span>
        </button>
      ))}
    </div>
  );
}
