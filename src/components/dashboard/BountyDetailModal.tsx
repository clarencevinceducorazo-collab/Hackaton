'use client';

import React, { useState, useRef, useCallback } from 'react';
import { User, Brain, AlertCircle, Clock } from 'lucide-react';
import { useEvaluation } from '@/app/hooks/useEvaluation';
import { EvaluationLoader } from '@/app/components/EvaluationLoader';
import { VerdictCard } from '@/app/components/VerdictCard';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bounty {
  id: string;
  title: string;
  description: string;
  requirements: string;
  reward: number;
  status: 'OPEN' | 'IN_REVIEW' | 'PAID';
  tags?: string[];
  postedBy?: string; 
  creatorAddress?: string;
  deadline?: string;
}

interface BountyDetailModalProps {
  bounty: Bounty | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitWork: (bounty: Bounty, submission: WorkSubmission) => void;
  onApproved: (bountyId: string) => void;
}

export interface WorkSubmission {
  githubRepo: string;
  description: string;
  images: File[];
}

type ModalPhase = 'form' | 'evaluating' | 'verdict';

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  OPEN:      { label: 'Open',      color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)'  },
  IN_REVIEW: { label: 'In Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)'  },
  PAID:      { label: 'Paid',      color: '#00d4ff', bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.25)'   },
};

// ─── Helper: validate GitHub URL ───────────────────────────────────────────────
const isValidGitHubUrl = (url: string) =>
  /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/.*)?$/.test(url.trim());

// ─── Component ────────────────────────────────────────────────────────────────
export function BountyDetailModal({ bounty, isOpen, onClose, onSubmitWork, onApproved }: BountyDetailModalProps) {
  const [view, setView]               = useState<'detail' | 'submit'>('detail');
  const [phase, setPhase]             = useState<ModalPhase>('form');
  const [githubRepo, setGithubRepo]   = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages]           = useState<File[]>([]);
  const [previews, setPreviews]       = useState<string[]>([]);
  const [dragOver, setDragOver]       = useState(false);
  const [repoTouched, setRepoTouched] = useState(false);
  const [valError, setValError]       = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isEvaluating, result, error: evalError, evaluate, reset, evaluationMs } = useEvaluation();

  const repoError = repoTouched && githubRepo !== '' && !isValidGitHubUrl(githubRepo);
  const canSubmit  = githubRepo.trim() !== '' && isValidGitHubUrl(githubRepo);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // ── Reset state on close ────────────────────────────────────────────────────
  const handleClose = () => {
    setView('detail');
    setPhase('form');
    setGithubRepo('');
    setDescription('');
    setImages([]);
    setPreviews([]);
    setDragOver(false);
    setRepoTouched(false);
    setValError(null);
    reset();
    onClose();
  };

  // ── Image handling ──────────────────────────────────────────────────────────
  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
      const next  = [...images, ...valid].slice(0, 5);
      setImages(next);
      const readers = next.map(
        file =>
          new Promise<string>(res => {
            const r = new FileReader();
            r.onload = e => res(e.target?.result as string);
            r.readAsDataURL(file);
          })
      );
      Promise.all(readers).then(setPreviews);
    },
    [images]
  );

  const removeImage = (index: number) => {
    setImages(prev   => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ── AI Evaluation Trigger ────────────────────────────────────────────────────
  const handleStartEvaluation = async () => {
    if (!bounty || !canSubmit) return;
    
    if (description.trim().length < 20) {
      setValError('Submission description must be at least 20 characters.');
      return;
    }

    setValError(null);
    setPhase('evaluating');
    
    await evaluate({
      bountyId: bounty.id,
      bountyTitle: bounty.title,
      bountyDescription: bounty.description,
      bountyRequirements: bounty.requirements,
      submission: `GitHub Repo: ${githubRepo}\n\nSubmission Details: ${description}`,
      submissionId: crypto.randomUUID(),
    });

    setPhase('verdict');
  };

  if (!isOpen || !bounty) return null;

  const status = STATUS_CONFIG[bounty.status];
  const requirements = bounty.requirements.split('\n').filter(r => r.trim());

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-[#050810]/80 backdrop-blur-md" onClick={handleClose} />

      <div role="dialog" className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #0d1424 0%, #0a1020 100%)',
            border: '1px solid rgba(59,130,246,0.18)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 pt-7 pb-5 border-b border-white/5 shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex gap-1 mb-4">
                {(['detail', 'submit'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setView(tab)}
                    disabled={tab === 'submit' && bounty.status !== 'OPEN'}
                    className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
                    style={{
                      background: view === tab ? 'rgba(0,212,255,0.12)' : 'transparent',
                      color:      view === tab ? '#00d4ff' : '#6b7a99',
                      border:     view === tab ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
                      cursor:     tab === 'submit' && bounty.status !== 'OPEN' ? 'not-allowed' : 'pointer',
                      opacity:    tab === 'submit' && bounty.status !== 'OPEN' ? 0.4 : 1,
                    }}
                  >
                    {tab === 'detail' ? '📋 Details' : '🚀 Submit Work'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}>
                  ● {status.label}
                </span>
                <span className="text-[10px] text-[#6b7a99] font-mono tracking-widest">ID: #{bounty.id.slice(0, 8)}</span>
              </div>

              <h2 className="mt-2 text-xl font-black text-[#eef2ff] tracking-tight leading-tight">{bounty.title}</h2>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7a99] hover:text-[#eef2ff] hover:bg-white/5 transition-all">✕</button>
              <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest">Reward</div>
                <div className="text-lg font-black text-[#00d4ff] font-mono leading-tight">{bounty.reward}</div>
                <div className="text-[9px] text-[#6b7a99]">ETH</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {view === 'detail' && (
              <div className="px-8 py-6 space-y-8">
                <section>
                  <h3 className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] mb-3">Description</h3>
                  <p className="text-[#c7d2fe] text-[15px] leading-relaxed font-light">{bounty.description}</p>
                </section>

                <section>
                  <h3 className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#c7d2fe]">
                        <span className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                          style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                          {i + 1}
                        </span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl flex items-center gap-4 bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#00d4ff] flex items-center justify-center text-sm font-black text-white shrink-0 shadow-lg">
                      {bounty.creatorAddress ? bounty.creatorAddress.slice(2, 3).toUpperCase() : <User size={16} />}
                    </div>
                    <div>
                      <div className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest mb-0.5">Posted By</div>
                      <div className="text-xs font-mono font-bold text-[#eef2ff]">
                        {bounty.creatorAddress ? truncateAddress(bounty.creatorAddress) : 'Anonymous'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl flex items-center gap-4 bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[#00d4ff]/10 flex items-center justify-center text-[#00d4ff] shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest mb-0.5">Posted On</div>
                      <div className="text-xs font-mono font-bold text-[#eef2ff]">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'submit' && (
              <div className="px-8 py-6">
                {phase === 'form' && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#00d4ff]/5 border border-[#00d4ff]/15">
                      <span className="text-2xl shrink-0">🤖</span>
                      <div className="space-y-1">
                        <p className="text-[#eef2ff] text-sm font-bold">Autonomous Review</p>
                        <p className="text-[#94a3b8] text-xs leading-relaxed">
                          Gemini 1.5 Flash will strictly evaluate your code and description against all requirements. Ensure your GitHub repo is public.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] mb-2">GitHub Repository <span className="text-[#f87171]">*</span></label>
                        <input type="url" value={githubRepo} onChange={e => setGithubRepo(e.target.value)} onBlur={() => setRepoTouched(true)} placeholder="https://github.com/username/repository" className="w-full px-4 py-3 rounded-xl text-sm text-[#eef2ff] bg-black/40 border border-white/10 outline-none focus:border-[#00d4ff]/50 transition-all font-mono" />
                        {repoError && <p className="mt-1.5 text-[11px] text-[#f87171]">Please enter a valid public GitHub URL</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] mb-2">Submission Details <span className="text-[#f87171]">*</span></label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe exactly how you met each requirement. The more explicit you are, the more likely the AI will approve your work." className="w-full px-4 py-3 rounded-xl text-sm text-[#eef2ff] bg-black/40 border border-white/10 outline-none resize-none focus:border-[#00d4ff]/50 transition-all" />
                        <div className="flex justify-between mt-1">
                          {valError && <p className="text-[11px] text-[#f87171]">{valError}</p>}
                          <p className="text-[10px] text-[#6b7a99] ml-auto font-mono">{description.length} / 2000</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                      <Brain className="text-[#00d4ff] w-5 h-5 animate-pulse" />
                      <p className="text-[11px] text-[#94a3b8] italic">Pro-tip: Number your points to match the bounty's requirements for a faster approval.</p>
                    </div>
                  </div>
                )}

                {phase === 'evaluating' && <EvaluationLoader />}

                {phase === 'verdict' && result && (
                  <VerdictCard 
                    result={result} 
                    onClose={() => setPhase('form')} 
                    evaluationMs={evaluationMs}
                    onClaimReward={result.verdict === 'APPROVED' ? () => onApproved(bounty.id) : undefined}
                  />
                )}

                {(evalError || valError) && phase === 'verdict' && !result && (
                  <div className="py-12 text-center">
                    <AlertCircle className="w-16 h-16 text-[#ef4444] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-black text-white mb-2 tracking-tight">Evaluation Halted</h3>
                    <p className="text-sm text-[#6b7a99] mb-8 max-w-[300px] mx-auto leading-relaxed">{evalError || valError}</p>
                    <button onClick={() => setPhase('form')} className="px-8 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-bold transition-all active:scale-95">Return to Submission</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 px-8 py-6 flex items-center justify-between gap-4 border-t border-white/5">
            {view === 'detail' ? (
              <>
                <button onClick={handleClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6b7a99] hover:text-[#eef2ff] transition-all">Close Details</button>
                {bounty.status === 'OPEN' ? (
                  <button onClick={() => setView('submit')} className="bg-[#00d4ff] text-[#050810] px-8 py-2.5 rounded-xl text-xs font-black shadow-xl shadow-[#00d4ff]/20 active:scale-95 transition-all uppercase tracking-widest">🚀 Submit Work</button>
                ) : (
                  <div className="flex items-center gap-2 text-[#6b7a99] text-[10px] font-bold uppercase tracking-widest px-5">
                    <ShieldCheck size={14} /> This bounty is closed
                  </div>
                )}
              </>
            ) : (
              phase === 'form' && (
                <>
                  <button onClick={() => setView('detail')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6b7a99] hover:text-[#eef2ff] transition-all">← Requirements</button>
                  <button onClick={handleStartEvaluation} disabled={!canSubmit || isEvaluating} className="bg-[#10b981] text-[#050810] px-8 py-2.5 rounded-xl text-xs font-black shadow-xl shadow-[#10b981]/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 uppercase tracking-widest">
                    <Brain size={16} /> Run AI Judge
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
