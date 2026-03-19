'use client';
import React from 'react';
import { EvaluationResult } from '../types/evaluation';
import { CheckCircle2, XCircle, Zap, ShieldCheck, ChevronRight } from 'lucide-react';

/**
 * @fileOverview High-impact display for AI evaluation results.
 */

interface VerdictCardProps {
  result: EvaluationResult;
  onClose: () => void;
  onClaimReward?: () => void;
  evaluationMs: number | null;
}

export function VerdictCard({ result, onClose, onClaimReward, evaluationMs }: VerdictCardProps) {
  const isApproved = result.verdict === 'APPROVED';

  return (
    <div className={`w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl ${
      isApproved 
        ? 'border border-[#10b981]/50 bg-[#10b981]/5' 
        : 'border border-[#ef4444]/40 bg-[#ef4444]/5'
    }`}>
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${isApproved ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />

      <div className="p-8">
        {/* Header row */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              isApproved ? 'bg-[#10b981]/20 text-[#10b981] shadow-[#10b981]/10' : 'bg-[#ef4444]/20 text-[#ef4444] shadow-[#ef4444]/10'
            }`}>
              {isApproved ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
            </div>
            <div>
              <h3 className={`text-2xl font-black font-mono tracking-tighter ${
                isApproved ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                {result.verdict}
              </h3>
              <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest">
                Official AI Verdict
              </p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
            isApproved ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
          }`}>
            {result.confidence}% confident
          </div>
        </div>

        {/* Reason Body */}
        <div className="mb-8">
          <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] block mb-3">
            JUDGE REASONING
          </span>
          <p className="text-[#eef2ff] text-[15px] leading-relaxed italic">
            "{result.reason}"
          </p>
        </div>

        {/* Criteria / Missing Section */}
        <div className="mb-10">
          <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] block mb-4">
            {isApproved ? 'REQUIREMENTS CHECKED' : 'WHAT WAS MISSING'}
          </span>
          <ul className="space-y-3">
            {(isApproved ? result.criteriaChecked : result.missingCriteria).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#c7d2fe]">
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

        {/* Rejection Advice */}
        {!isApproved && (
          <div className="p-5 rounded-xl bg-white/[0.03] border-l-4 border-[#ef4444]/50 mb-8">
            <p className="text-[13px] text-[#94a3b8] leading-relaxed">
              Read the gaps above, update your submission, and try again. The AI treats every attempt as a fresh evaluation.
            </p>
          </div>
        )}

        {/* Action Row */}
        {isApproved && onClaimReward ? (
          <button
            onClick={onClaimReward}
            className="w-full bg-[#00d4ff] hover:bg-[#00e5ff] text-[#050810] font-black text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-[#00d4ff]/20 flex items-center justify-center gap-3 group mb-4"
          >
            <Zap size={18} fill="currentColor" className="group-hover:animate-pulse" />
            Claim ETH Reward
            <ChevronRight size={16} />
          </button>
        ) : !isApproved && (
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
          >
            Resubmit Improved Work
          </button>
        )}
        
        {isApproved && (
          <p className="text-center text-[10px] text-[#6b7a99] font-mono tracking-widest uppercase">
            ⚡ Payout via Ethereum Sepolia testnet
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-[#6b7a99] uppercase tracking-widest pt-6 mt-4 border-t border-white/[0.05]">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#6b7a99]" /> {result.model}</span>
          <span>•</span>
          <span>Evaluated in {(evaluationMs || 0) / 1000}s</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#10b981]"><ShieldCheck size={12} /> Autonomous</span>
        </div>
      </div>
    </div>
  );
}
