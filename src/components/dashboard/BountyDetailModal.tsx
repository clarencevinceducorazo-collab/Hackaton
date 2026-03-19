'use client';

import React, { useState, useRef, useCallback } from 'react';
import { User } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: 'OPEN' | 'IN_REVIEW' | 'PAID';
  tags?: string[];
  postedBy?: string; 
  creatorAddress?: string;
  deadline?: string;
  requirements?: string | string[];
}

interface BountyDetailModalProps {
  bounty: Bounty | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitWork: (bounty: Bounty, submission: WorkSubmission) => void;
}

export interface WorkSubmission {
  githubRepo: string;
  description: string;
  images: File[];
}

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
export function BountyDetailModal({ bounty, isOpen, onClose, onSubmitWork }: BountyDetailModalProps) {
  const [view, setView]               = useState<'detail' | 'submit'>('detail');
  const [githubRepo, setGithubRepo]   = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages]           = useState<File[]>([]);
  const [previews, setPreviews]       = useState<string[]>([]);
  const [dragOver, setDragOver]       = useState(false);
  const [repoTouched, setRepoTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const repoError = repoTouched && githubRepo !== '' && !isValidGitHubUrl(githubRepo);
  const canSubmit  = githubRepo.trim() !== '' && isValidGitHubUrl(githubRepo);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // ── Reset state on close ────────────────────────────────────────────────────
  const handleClose = () => {
    setView('detail');
    setGithubRepo('');
    setDescription('');
    setImages([]);
    setPreviews([]);
    setDragOver(false);
    setRepoTouched(false);
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

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!bounty || !canSubmit) return;
    onSubmitWork(bounty, { githubRepo: githubRepo.trim(), description, images });
    handleClose();
  };

  if (!isOpen || !bounty) return null;

  const status = STATUS_CONFIG[bounty.status];

  // Safe arrays — guard against undefined / non-array data shapes
  const requirements = Array.isArray(bounty.requirements) 
    ? bounty.requirements 
    : typeof bounty.requirements === 'string' 
      ? [bounty.requirements] 
      : [];
  const tags         = Array.isArray(bounty.tags)         ? bounty.tags         : [];

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-[200] bg-[#050810]/80 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bounty-modal-title"
        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0d1424 0%, #0a1020 100%)',
            border: '1px solid rgba(59,130,246,0.18)',
            boxShadow: '0 0 0 1px rgba(0,212,255,0.06), 0 40px 80px rgba(0,0,0,0.6)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-start justify-between px-8 pt-7 pb-5 border-b border-[rgba(59,130,246,0.1)] shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              {/* Tab switcher */}
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
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                >
                  ● {status.label}
                </span>
                <span className="text-[10px] text-[#6b7a99] font-mono">
                  ID: #{bounty.id.slice(0, 8)}
                </span>
              </div>

              <h2
                id="bounty-modal-title"
                className="mt-2 text-xl font-black text-[#eef2ff] tracking-tight leading-tight"
              >
                {bounty.title}
              </h2>
            </div>

            {/* Reward badge + close */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7a99] hover:text-[#eef2ff] hover:bg-white/5 transition-all"
                aria-label="Close modal"
              >
                ✕
              </button>
              <div
                className="px-4 py-2 rounded-xl text-center"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
              >
                <div className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest">Reward</div>
                <div className="text-lg font-black text-[#00d4ff] font-mono leading-tight">{bounty.reward}</div>
                <div className="text-[9px] text-[#6b7a99]">ETH</div>
              </div>
            </div>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ─────────── DETAIL VIEW ─────────── */}
            {view === 'detail' && (
              <div className="px-8 py-6 space-y-6">

                {/* Description */}
                <section>
                  <SectionLabel>Description</SectionLabel>
                  <p className="text-[#c7d2fe] text-sm leading-relaxed">{bounty.description}</p>
                </section>

                {/* Requirements */}
                {requirements.length > 0 && (
                  <section>
                    <SectionLabel>Requirements</SectionLabel>
                    <ul className="space-y-2">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#c7d2fe]">
                          <span
                            className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                            style={{
                              background: 'rgba(0,212,255,0.1)',
                              color: '#00d4ff',
                              border: '1px solid rgba(0,212,255,0.2)',
                            }}
                          >
                            {i + 1}
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <section>
                    <SectionLabel>Tags</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-[11px] font-semibold"
                          style={{
                            background: 'rgba(59,130,246,0.08)',
                            color: '#818cf8',
                            border: '1px solid rgba(59,130,246,0.2)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Meta row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: 'rgba(13,20,36,0.6)', border: '1px solid rgba(59,130,246,0.12)' }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#00d4ff] flex items-center justify-center text-sm font-black text-white shrink-0 shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                      {bounty.creatorAddress ? bounty.creatorAddress.slice(2, 3).toUpperCase() : <User size={16} />}
                    </div>
                    <div>
                      <div className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest mb-0.5">Posted By</div>
                      <div className="text-xs font-mono font-bold text-[#eef2ff]">
                        {bounty.creatorAddress ? truncateAddress(bounty.creatorAddress) : 'Anonymous'}
                      </div>
                    </div>
                  </div>

                  {bounty.deadline && (
                    <MetaBox
                      label="Deadline"
                      value={
                        <span className="text-xs text-[#c7d2fe]">
                          {new Date(bounty.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {/* ─────────── SUBMIT VIEW ─────────── */}
            {view === 'submit' && (
              <div className="px-8 py-6 space-y-6">

                {/* Info banner */}
                <div
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                >
                  <span className="text-lg shrink-0">🤖</span>
                  <p className="text-[#c7d2fe] text-xs leading-relaxed">
                    Your submission will be reviewed by an{' '}
                    <strong className="text-[#00d4ff]">AI Judge</strong>. Provide a public GitHub
                    repository — the AI will analyze the code and verify it meets all bounty
                    requirements. Screenshots or demos are optional but help.
                  </p>
                </div>

                {/* GitHub Repo — REQUIRED */}
                <div>
                  <label className="block text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-2">
                    GitHub Repository <span className="text-[#f87171]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7a99] text-sm select-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </span>
                    <input
                      type="url"
                      value={githubRepo}
                      onChange={e => setGithubRepo(e.target.value)}
                      onBlur={() => setRepoTouched(true)}
                      placeholder="https://github.com/username/repository"
                      className="w-full pl-10 pr-8 py-3 rounded-xl text-sm text-[#eef2ff] placeholder:text-[#6b7a99] outline-none transition-all"
                      style={{
                        background: 'rgba(13,20,36,0.8)',
                        border: repoError
                          ? '1px solid rgba(248,113,113,0.5)'
                          : githubRepo !== '' && isValidGitHubUrl(githubRepo)
                          ? '1px solid rgba(16,185,129,0.4)'
                          : '1px solid rgba(59,130,246,0.2)',
                      }}
                    />
                    {githubRepo !== '' && isValidGitHubUrl(githubRepo) && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#10b981] text-sm">
                        ✓
                      </span>
                    )}
                  </div>
                  {repoError && (
                    <p className="mt-1.5 text-[11px] text-[#f87171]">
                      Please enter a valid GitHub repository URL (e.g. https://github.com/user/repo)
                    </p>
                  )}
                </div>

                {/* Submission Notes — OPTIONAL */}
                <div>
                  <label className="block text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-2">
                    Submission Notes{' '}
                    <span className="text-[#6b7a99] font-normal normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Describe your approach, what you built, or anything important for the AI reviewer to know..."
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#eef2ff] placeholder:text-[#6b7a99] outline-none resize-none transition-all"
                    style={{
                      background: 'rgba(13,20,36,0.8)',
                      border: '1px solid rgba(59,130,246,0.2)',
                    }}
                    onFocus={e => (e.currentTarget.style.border = '1px solid rgba(0,212,255,0.35)')}
                    onBlur={e  => (e.currentTarget.style.border = '1px solid rgba(59,130,246,0.2)')}
                  />
                  <p className="mt-1 text-right text-[10px] text-[#6b7a99]">
                    {description.length}/500
                  </p>
                </div>

                {/* Screenshots — OPTIONAL */}
                <div>
                  <label className="block text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-2">
                    Screenshots / Demos{' '}
                    <span className="text-[#6b7a99] font-normal normal-case tracking-normal">
                      (optional · max 5)
                    </span>
                  </label>

                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all select-none"
                    style={{
                      minHeight: 96,
                      background: dragOver ? 'rgba(0,212,255,0.06)' : 'rgba(13,20,36,0.6)',
                      border: dragOver
                        ? '1.5px dashed rgba(0,212,255,0.5)'
                        : '1.5px dashed rgba(59,130,246,0.2)',
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => addFiles(e.target.files)}
                    />
                    {images.length === 0 ? (
                      <>
                        <span className="text-2xl mb-1">🖼️</span>
                        <p className="text-[11px] text-[#6b7a99]">
                          Drag & drop images, or{' '}
                          <span className="text-[#00d4ff]">click to browse</span>
                        </p>
                        <p className="text-[10px] text-[#6b7a99] mt-0.5">PNG, JPG, GIF, WebP</p>
                      </>
                    ) : (
                      <p className="text-[11px] text-[#00d4ff] py-3">
                        + Add more images ({images.length}/5)
                      </p>
                    )}
                  </div>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {previews.map((src, i) => (
                        <div
                          key={i}
                          className="relative group aspect-square rounded-lg overflow-hidden"
                          style={{ border: '1px solid rgba(59,130,246,0.2)' }}
                        >
                          <img
                            src={src}
                            alt={`preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={e => { e.stopPropagation(); removeImage(i); }}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-lg font-bold"
                            style={{ background: 'rgba(0,0,0,0.6)' }}
                            aria-label={`Remove image ${i + 1}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            className="shrink-0 px-8 py-5 flex items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}
          >
            {view === 'detail' ? (
              <>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6b7a99] hover:text-[#eef2ff] hover:bg-white/5 transition-all"
                >
                  Close
                </button>
                {bounty.status === 'OPEN' ? (
                  <button
                    onClick={() => setView('submit')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#050810] transition-all active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                      boxShadow: '0 0 20px rgba(0,212,255,0.25)',
                    }}
                  >
                    <span>🚀</span> Submit Work
                  </button>
                ) : (
                  <span
                    className="px-5 py-2.5 rounded-xl text-xs font-bold"
                    style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                  >
                    {bounty.status === 'IN_REVIEW' ? '⏳ Under Review' : '✅ Bounty Closed'}
                  </span>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setView('detail')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6b7a99] hover:text-[#eef2ff] hover:bg-white/5 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#050810] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: canSubmit
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'rgba(16,185,129,0.3)',
                    boxShadow: canSubmit ? '0 0 20px rgba(16,185,129,0.25)' : 'none',
                  }}
                >
                  <span>🤖</span> Send to AI Judge
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

function MetaBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'rgba(13,20,36,0.6)', border: '1px solid rgba(59,130,246,0.12)' }}
    >
      <div className="text-[9px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">{label}</div>
      {value}
    </div>
  );
}