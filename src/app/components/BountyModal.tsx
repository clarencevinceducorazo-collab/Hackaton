'use client';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { User } from 'lucide-react';

interface BountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (bounty: any) => void;
}

export function BountyModal({ isOpen, onClose, onPost }: BountyModalProps) {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    reward: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.requirements || !formData.reward) return;
    
    setLoading(true);
    // Simulate short on-chain prep
    await new Promise(r => setTimeout(r, 800));
    
    onPost({
      ...formData,
      reward: parseFloat(formData.reward),
      status: 'OPEN',
    });
    
    setLoading(false);
    setFormData({ title: '', description: '', requirements: '', reward: '' });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-[#0d1424] w-full max-w-lg rounded-2xl border border-[rgba(59,130,246,0.2)] shadow-2xl p-8 modal-enter overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3b82f6]/10 blur-[60px] rounded-full pointer-events-none" />
        
        <h2 className="text-2xl font-black text-[#eef2ff] mb-6 tracking-tight relative">Post New Bounty</h2>
        
        {/* Posting As Identity */}
        <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a855f7] to-[#00d4ff] flex items-center justify-center text-lg font-black text-white shrink-0 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            {address ? address.slice(2, 3).toUpperCase() : <User size={20} />}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-[0.2em] leading-none mb-1">Posting As</span>
            <span className="text-sm text-[#eef2ff] font-mono font-bold">
              {address ? truncateAddress(address) : 'Guest (Connect Wallet)'}
            </span>
            {!isConnected && (
              <span className="text-[10px] text-[#ef4444] font-bold mt-1">Connection recommended for payouts</span>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div>
            <label className="block text-[11px] font-bold text-[#6b7a99] uppercase tracking-widest mb-2">Bounty Title</label>
            <input
              required
              className="w-full bg-[#050810] border border-[rgba(59,130,246,0.15)] rounded-xl px-4 py-3 text-[#eef2ff] text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
              placeholder="e.g. Audit smart contract"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6b7a99] uppercase tracking-widest mb-2">Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-[#050810] border border-[rgba(59,130,246,0.15)] rounded-xl px-4 py-3 text-[#eef2ff] text-sm focus:outline-none focus:border-[#00d4ff] transition-colors resize-none"
              placeholder="What is this bounty about?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6b7a99] uppercase tracking-widest mb-2">Requirements</label>
            <textarea
              required
              rows={3}
              className="w-full bg-[#050810] border border-[rgba(59,130,246,0.15)] rounded-xl px-4 py-3 text-[#eef2ff] text-sm focus:outline-none focus:border-[#00d4ff] transition-colors resize-none"
              placeholder="List criteria for the AI judge..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6b7a99] uppercase tracking-widest mb-2">Reward (ETH)</label>
            <div className="relative">
              <input
                required
                type="number"
                step="0.0001"
                min="0.0001"
                className="w-full bg-[#050810] border border-[rgba(59,130,246,0.15)] rounded-xl pl-4 pr-12 py-3 text-[#eef2ff] text-sm focus:outline-none focus:border-[#00d4ff] transition-colors font-mono"
                placeholder="e.g. 0.001"
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a99] font-bold text-[10px]">ETH</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[rgba(255,255,255,0.1)] text-[#94a3b8] font-bold text-sm rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isConnected}
              className="flex-1 px-6 py-3 bg-[#3b82f6] hover:bg-[#00d4ff] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Posting...</span>
                </div>
              ) : 'Post Bounty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
