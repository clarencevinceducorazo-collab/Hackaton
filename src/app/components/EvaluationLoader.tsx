'use client';

import React from 'react';

/**
 * @fileOverview High-fidelity AI evaluation loading state.
 */

export function EvaluationLoader() {
  return (
    <div className="w-full bg-[#0d1424] border border-[#00d4ff]/30 rounded-2xl p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d4ff]/5 to-transparent -translate-x-full animate-shimmer" />
      
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="flex gap-3 mb-8">
          <div className="w-4 h-4 bg-[#00d4ff] rounded-full animate-pulse" />
          <div className="w-4 h-4 bg-[#00d4ff] rounded-full animate-pulse [animation-delay:0.2s]" />
          <div className="w-4 h-4 bg-[#00d4ff] rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>

        <h3 className="text-2xl font-black font-display text-[#00d4ff] mb-2 tracking-tight">AI Judge Evaluating...</h3>
        <p className="text-[#6b7a99] text-sm mb-10 max-w-[300px] font-body">Reading requirements and analyzing your submission content...</p>

        <div className="w-full max-w-[400px] flex items-center justify-between px-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-xs font-black text-[#04070f]">✓</div>
            <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-widest">Parsing</span>
          </div>
          <div className="flex-1 h-px bg-white/10 mx-2" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#f59e0b] border-t-transparent animate-spin" />
            <span className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest animate-pulse">Checking</span>
          </div>
          <div className="flex-1 h-px bg-white/10 mx-2" />
          <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black">...</div>
            <span className="text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-widest">Verdict</span>
          </div>
        </div>

        <p className="mt-12 text-[10px] text-[#6b7a99] font-mono tracking-widest uppercase">Gemini 1.5 Flash — typically 2-3 seconds</p>
      </div>
    </div>
  );
}
