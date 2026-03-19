'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Bounty, Transaction, ToastMessage } from './types';
import { useBounties } from './hooks/useBounties';
import { useTransactions } from './hooks/useTransactions';
import { BountyCard } from './components/BountyCard';
import { BountyModal } from './components/BountyModal';
import { SubmitModal } from './components/SubmitModal';
import { FilterBar } from './components/FilterBar';
import { NetworkBadge } from './components/NetworkBadge';
import { WalletButton } from './components/WalletButton';
import { TransactionHistory } from './components/TransactionHistory';
import { Toast } from './components/Toast';
import { Plus, Diamond, Sparkles, LayoutGrid } from 'lucide-react';

/**
 * @fileOverview Main dashboard orchestration.
 */

export default function Dashboard() {
  const { bounties, addBounty, updateBountyStatus, isLoaded } = useBounties();
  const { transactions, addTransaction } = useTransactions();
  const { address, isConnected } = useAccount();

  const [activeFilter, setActiveFilter] = useState('all');
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [submitTarget, setSubmitTarget] = useState<Bounty | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filtering Logic
  const filtered = bounties.filter(b => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'open') return b.status === 'OPEN' || b.status === 'REJECTED';
    if (activeFilter === 'in_review') return b.status === 'IN_REVIEW';
    if (activeFilter === 'paid') return b.status === 'PAID';
    return true;
  });

  const counts = {
    all: bounties.length,
    open: bounties.filter(b => b.status === 'OPEN' || b.status === 'REJECTED').length,
    inReview: bounties.filter(b => b.status === 'IN_REVIEW').length,
    paid: bounties.filter(b => b.status === 'PAID').length,
  };

  const showToast = (message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const handleAddBounty = (data: any) => {
    addBounty({ ...data, creatorAddress: address });
    showToast('Bounty posted to the board!', 'success');
    setShowBountyModal(false);
  };

  const handleApproved = (bountyId: string, txHash?: string) => {
    updateBountyStatus(bountyId, 'PAID');
    setSubmitTarget(null);
    showToast('Submission approved! Reward claimed 🎉', 'success');
    
    if (txHash) {
      const bounty = bounties.find(b => b.id === bountyId);
      addTransaction({
        txHash,
        amount: bounty?.reward || 0,
        recipient: address || 'unknown',
        timestamp: new Date().toISOString(),
        bountyTitle: bounty?.title || 'Unknown Bounty',
        status: 'confirmed'
      });
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#04070f] text-[#eef2ff]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#04070f]/80 backdrop-blur-xl border-b border-white/5 z-[100] px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00d4ff] flex items-center justify-center rounded-lg rotate-45 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <Diamond className="-rotate-45 text-[#04070f]" size={20} />
          </div>
          <span className="font-display font-[800] text-2xl tracking-tighter bg-gradient-to-r from-[#eef2ff] to-[#6b7a99] bg-clip-text text-transparent">AI Bounty Board</span>
        </div>

        <div className="hidden md:block">
          <NetworkBadge />
        </div>

        <div className="flex items-center gap-4">
          <WalletButton />
          <button 
            onClick={() => setShowBountyModal(true)}
            className="bg-[#3b82f6] hover:bg-[#00d4ff] text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} /> Post Bounty
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 px-8 max-w-[1400px] mx-auto">
        
        {/* HERO STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total Bounties', value: bounties.length, icon: <LayoutGrid size={16}/> },
            { label: 'Available', value: counts.open, icon: <Sparkles size={16}/> },
            { label: 'Total ETH Reward', value: bounties.reduce((s,b)=>s+b.reward,0).toFixed(2), icon: <Diamond size={16}/> }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d1424] border border-white/5 p-6 rounded-2xl flex flex-col gap-1 relative overflow-hidden group hover:border-[#00d4ff]/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d4ff]/5 blur-[40px] group-hover:bg-[#00d4ff]/10 transition-all" />
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#6b7a99] uppercase tracking-[0.2em] mb-2">
                <span className="text-[#00d4ff]">{stat.icon}</span> {stat.label}
              </div>
              <span className="text-4xl font-mono font-black text-[#eef2ff] tracking-tighter">
                {stat.value}{stat.label.includes('ETH') ? '' : ''}
              </span>
            </div>
          ))}
        </div>

        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

        {/* GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {filtered.map(b => (
              <BountyCard key={b.id} bounty={b} onSubmitWork={setSubmitTarget} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-[#0d1424]/40 rounded-3xl border border-dashed border-white/5">
            <LayoutGrid size={64} className="text-[#6b7a99] opacity-20 mb-6" />
            <h3 className="text-2xl font-display font-black text-[#6b7a99] mb-2 tracking-tight">No bounties found</h3>
            <p className="text-[#6b7a99] font-body mb-8">Be the first to post a task to the global board.</p>
            <button 
              onClick={() => setShowBountyModal(true)}
              className="bg-white/5 hover:bg-white/10 text-white font-bold text-sm py-3 px-8 rounded-xl border border-white/10 transition-all"
            >
              Post First Bounty →
            </button>
          </div>
        )}

        <TransactionHistory transactions={transactions} />
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-[11px] font-mono text-[#6b7a99] tracking-widest uppercase">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" /> AI Judge Active</span>
          <span className="opacity-20">|</span>
          <span>Base Sepolia Layer 2</span>
        </div>
        Built on Base · Powered by Gemini AI · Base Batches 2026
      </footer>

      {/* MODALS */}
      <BountyModal 
        isOpen={showBountyModal} 
        onClose={() => setShowBountyModal(false)} 
        onSubmit={handleAddBounty} 
      />

      <SubmitModal 
        bounty={submitTarget} 
        isOpen={submitTarget !== null} 
        onClose={() => setSubmitTarget(null)} 
        onApproved={handleApproved} 
        walletAddress={address}
      />

      {/* TOASTS */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-[1000]">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </div>
  );
}
