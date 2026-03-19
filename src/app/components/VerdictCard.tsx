'use client';

import React from 'react';
import { EvaluationResult } from '../types';
import { CheckCircle2, XCircle, ShieldCheck, Zap, ChevronRight, X } from 'lucide-react';

/**
 * @fileOverview Final AI verdict display card.
 */

interface VerdictCardProps {
  result: EvaluationResult;
  onClose: () => void;
  onClaimReward?: () => void;
}

export function VerdictCard({ result, onClose, onClaimReward }: VerdictCardProps) {
  const isApproved = result.verdict === 'APPROVED';

  return (
    <div className={`w-full rounded-2xl overflow-hidden animate-verdict-appear shadow-2xl relative ${
      isApproved 
        ? 'border border-[#10b981]/40 bg-[#10b981]/5' 
        : 'border border-[#ef4444]/35 bg-[#ef4444]/5'
    }`}>
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${isApproved ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />

      <button onClick={onClose} className="absolute top-4 right-4 text-[#6b7a99] hover:text-white transition-colors">
        <X size={20} />
      </button>

      <div className="p-8">
        <div className="flex justify-between items-start mb-8 pr-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isApproved ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
            }`}>
              {isApproved ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
            </div>
            <div>
              <h3 className={`text-2xl font-black font-mono tracking-tighter ${
                isApproved ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                {result.verdict}
              </h3>
              <p className="text-[10px] text-[#6b7a99] font-mono font-bold uppercase tracking-widest">Autonomous AI Verdict</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[11px] font-mono font-black uppercase tracking-widest ${
            isApproved ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
          }`}>
            {result.confidence}% confident
          </div>
        </div>

        <div className="mb-8">
          <span className="text-[10px] text-[#6b7a99] font-mono font-bold uppercase tracking-[0.2em] block mb-3">AI Judge Reasoning</span>
          <p className="text-[#eef2ff] text-[16px] leading-relaxed font-body">"{result.reason}"</p>
        </div>

        <div className="mb-10">
          <span className="text-[10px] text-[#6b7a99] font-mono font-bold uppercase tracking-[0.2em] block mb-4">
            {isApproved ? 'Requirements Checked' : 'What Was Missing'}
          </span>
          <ul className="space-y-3">
            {(isApproved ? result.criteriaChecked : result.missingCriteria).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#c7d2fe] font-body">
                <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isApproved ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                }`}>
                  {isApproved ? '✓' : '✗'}
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {!isApproved && (
          <div className="p-5 rounded-xl bg-white/[0.03] border-l-4 border-[#ef4444]/50 mb-8">
            <p className="text-[13px] text-[#94a3b8] leading-relaxed font-body">
              Read the missing criteria above, improve your submission, and resubmit. Each attempt is evaluated fresh by the AI agent.
            </p>
          </div>
        )}

        {isApproved && onClaimReward && (
          <button
            onClick={onClaimReward}
            className="w-full bg-[#00d4ff] hover:bg-[#00e5ff] text-[#04070f] font-black text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-[#00d4ff]/20 flex items-center justify-center gap-3 group animate-pulse-glow"
          >
            <Zap size={18} fill="currentColor" />
            Claim ETH Reward
            <ChevronRight size={16} />
          </button>
        )}

        <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-[#6b7a99] uppercase tracking-widest pt-6 mt-4 border-t border-white/[0.05]">
          <span>Model: {result.model}</span>
          <span>•</span>
          <span>Evaluated in {(result.evaluationMs / 1000).toFixed(1)}s</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#10b981] font-bold"><ShieldCheck size={12} /> Bias-free</span>
        </div>
      </div>
    </div>
  );
}
