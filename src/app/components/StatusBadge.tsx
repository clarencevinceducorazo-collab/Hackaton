import React from 'react';
import { Bounty } from '../types';

/**
 * @fileOverview Status indicator pill with JetBrains Mono typography.
 */

export function StatusBadge({ status }: { status: Bounty['status'] }) {
  const configs = {
    OPEN: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', label: 'OPEN' },
    IN_REVIEW: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', label: 'IN REVIEW' },
    PAID: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa', label: 'PAID ✓' },
    REJECTED: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', label: 'REJECTED' },
  };

  const c = configs[status];

  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border"
      style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
    >
      {c.label}
    </span>
  );
}
