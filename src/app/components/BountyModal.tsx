'use client';

import React, { useState } from 'react';
import { X, DollarSign, Brain } from 'lucide-react';

/**
 * @fileOverview Creation modal for new bounties.
 */

interface BountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function BountyModal({ isOpen, onClose, onSubmit }: BountyModalProps) {
  const [formData, setFormData] = useState({ title: '', description: '', requirements: '', reward: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.requirements || !formData.reward) return;
    
    setLoading(true);
    // Simulate slight prep time
    await new Promise(r => setTimeout(r, 600));
    onSubmit({ ...formData, reward: parseFloat(formData.reward) });
    setLoading(false);
    setFormData({ title: '', description: '', requirements: '', reward: '' });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      
      <div className="relative bg-[#0d1424] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-8 animate-modal-content overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4ff]/5 blur-[60px] pointer-events-none" />
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black font-display text-[#eef2ff] tracking-tight">Post New Bounty</h2>
          <button onClick={onClose} className="text-[#6b7a99] hover:text-white transition-colors"><X size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em] mb-2">Bounty Title</label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#eef2ff] outline-none focus:border-[#00d4ff]/50 transition-all font-body"
              placeholder="e.g. Audit smart contract"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em] mb-2">Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#eef2ff] outline-none focus:border-[#00d4ff]/50 transition-all resize-none font-body"
              placeholder="What needs to be done?"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em] mb-2">Requirements</label>
            <textarea
              required
              rows={5}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#eef2ff] outline-none focus:border-[#00d4ff]/50 transition-all resize-none font-body"
              placeholder="1. Must do X&#10;2. Must do Y..."
              value={formData.requirements}
              onChange={e => setFormData({ ...formData, requirements: e.target.value })}
            />
            <p className="mt-2 text-[10px] text-[#6b7a99] flex items-center gap-1.5 font-body">
              <Brain size={12} className="text-[#00d4ff]" /> More specific requirements = better AI evaluation
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em] mb-2 text-right">Reward (ETH)</label>
            <div className="relative">
              <input
                required
                type="number"
                step="0.001"
                min="0.001"
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#eef2ff] outline-none focus:border-[#00d4ff]/50 transition-all font-mono"
                placeholder="0.01"
                value={formData.reward}
                onChange={e => setFormData({ ...formData, reward: e.target.value })}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00d4ff] font-bold"><DollarSign size={16}/></span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-white/10 text-[#6b7a99] font-bold text-sm rounded-xl hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#3b82f6] hover:bg-[#00d4ff] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Bounty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
