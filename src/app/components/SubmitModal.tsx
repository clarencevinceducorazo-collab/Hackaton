'use client';

import React, { useState } from 'react';
import { Bounty } from '../types';
import { useEvaluation } from '../hooks/useEvaluation';
import { EvaluationLoader } from './EvaluationLoader';
import { VerdictCard } from './VerdictCard';
import { Brain, FileText, X } from 'lucide-react';

/**
 * @fileOverview Submission state machine modal.
 */

interface SubmitModalProps {
  bounty: Bounty | null;
  isOpen: boolean;
  onClose: () => void;
  onApproved: (bountyId: string, txHash?: string) => void;
  walletAddress?: string;
}

export function SubmitModal({ bounty, isOpen, onClose, onApproved, walletAddress }: SubmitModalProps) {
  const [phase, setPhase] = useState<'form' | 'evaluating' | 'verdict'>('form');
  const [content, setContent] = useState('');
  const [valError, setValError] = useState('');
  const { isEvaluating, result, error: aiError, evaluate, reset } = useEvaluation();

  if (!isOpen || !bounty) return null;

  const handleModalClose = () => {
    reset();
    setPhase('form');
    setContent('');
    setValError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (content.trim().length < 20) {
      setValError('Submission too short. Describe your work in at least 20 characters.');
      return;
    }

    setPhase('evaluating');
    await evaluate({
      bountyId: bounty.id,
      bountyTitle: bounty.title,
      bountyDescription: bounty.description,
      bountyRequirements: bounty.requirements,
      submission: content,
      submissionId: crypto.randomUUID(),
    });
    setPhase('verdict');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={handleModalClose} />
      
      <div className="relative bg-[#0d1424] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl p-8 animate-modal-content">
        {phase === 'form' && (
          <>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black font-display text-[#eef2ff] tracking-tight mb-1">Submit Your Work</h2>
                <p className="text-sm text-[#6b7a99] font-body">For bounty: <span className="text-[#00d4ff] font-bold">{bounty.title}</span></p>
              </div>
              <button onClick={handleModalClose} className="text-[#6b7a99] hover:text-white"><X size={24}/></button>
            </div>

            <div className="mb-8 p-5 bg-black/40 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em] block mb-3">AI Requirements to Check</span>
              <ul className="space-y-2">
                {bounty.requirements.split('\n').map((r, i) => (
                  <li key={i} className="text-xs text-[#c7d2fe] flex gap-2 font-body">
                    <span className="text-[#00d4ff]">{i + 1}.</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em]">Your Submission</label>
              <textarea
                required
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-[#eef2ff] outline-none focus:border-[#00d4ff]/50 transition-all font-body leading-relaxed"
                placeholder="Describe your work, paste a code block, or provide a GitHub link. Be explicit about how you met each requirement."
                value={content}
                onChange={e => { setContent(e.target.value); setValError(''); }}
              />
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono ${valError ? 'text-red-400' : 'text-[#6b7a99]'}`}>
                  {valError || `${content.length} / 2000 characters`}
                </span>
                <div className="flex items-center gap-2 p-3 bg-[#00d4ff]/5 border border-[#00d4ff]/10 rounded-lg">
                  <Brain size={14} className="text-[#00d4ff]" />
                  <p className="text-[10px] text-[#94a3b8] italic font-body">Tip: Number your points to match requirements</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full mt-8 bg-[#3b82f6] hover:bg-[#00d4ff] text-white font-bold text-sm py-4 rounded-xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FileText size={18} /> Submit for AI Review →
            </button>
          </>
        )}

        {phase === 'evaluating' && <EvaluationLoader />}

        {phase === 'verdict' && result && (
          <VerdictCard 
            result={result} 
            bountyTitle={bounty.title} 
            onClose={() => setPhase('form')}
            onClaimReward={result.verdict === 'APPROVED' ? () => onApproved(bounty.id) : undefined}
          />
        )}

        {phase === 'verdict' && aiError && (
          <div className="py-12 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-black text-white mb-2">Evaluation Error</h3>
            <p className="text-sm text-[#6b7a99] mb-8 max-w-[300px] mx-auto leading-relaxed">{aiError}</p>
            <button onClick={() => setPhase('form')} className="px-8 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-bold transition-all">Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
