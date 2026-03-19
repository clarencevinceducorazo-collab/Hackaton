'use client';
import React, { useState } from 'react';
import { useBounties } from '../hooks/useBounties';
import { BountyCard } from '../components/BountyCard';
import { BountyModal } from '../components/BountyModal';
import { FilterBar } from '../components/FilterBar';
import { Toast } from '../components/Toast';

export default function DashboardPage() {
  const { bounties, addBounty, isLoaded } = useBounties();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const filteredBounties = bounties.filter(b => 
    activeFilter === 'ALL' || b.status === activeFilter
  );

  const counts = {
    ALL: bounties.length,
    OPEN: bounties.filter(b => b.status === 'OPEN').length,
    IN_REVIEW: bounties.filter(b => b.status === 'IN_REVIEW').length,
    PAID: bounties.filter(b => b.status === 'PAID').length,
  };

  const totalUSDC = bounties.reduce((acc, b) => acc + b.reward, 0);

  const handlePostBounty = (data: any) => {
    addBounty(data);
    setIsModalOpen(false);
    setToast({ message: 'Bounty posted successfully!', type: 'success' });
  };

  const handleSubmitWork = (bounty: any) => {
    console.log('Submission for:', bounty.title);
    setToast({ message: 'Submission received! AI judge is reviewing...', type: 'info' });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#050810] text-[#eef2ff] font-['DM_Sans'] selection:bg-[#00d4ff]/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#050810]/80 backdrop-blur-xl border-b border-[rgba(59,130,246,0.12)] z-[100] px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00d4ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] animate-pulse shadow-[0_0_15px_rgba(0,212,255,0.4)]" />
          <span className="font-extrabold tracking-tighter text-lg">AI Bounty Board</span>
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.25)] px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
          <span className="text-[#10b981] text-[10px] font-mono font-bold tracking-widest uppercase">⚡ Base Sepolia Testnet</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-5 py-2 border border-[rgba(255,255,255,0.1)] rounded-lg text-xs font-bold hover:bg-white/5 transition-colors">
            Connect Wallet
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00d4ff] text-[#050810] px-5 py-2 rounded-lg text-xs font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all active:scale-95"
          >
            Post Bounty
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 pb-20 px-8 max-w-[1400px] mx-auto">
        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] p-5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">Total Bounties</span>
            <span className="text-3xl font-black text-[#eef2ff] font-mono">{counts.ALL}</span>
          </div>
          <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] p-5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">Open Opportunities</span>
            <span className="text-3xl font-black text-[#10b981] font-mono">{counts.OPEN}</span>
          </div>
          <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] p-5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">Total Reward Pool</span>
            <span className="text-3xl font-black text-[#00d4ff] font-mono">${totalUSDC} USDC</span>
          </div>
        </div>

        {/* FILTERS */}
        <FilterBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          counts={counts}
        />

        {/* GRID */}
        {filteredBounties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBounties.map((b) => (
              <BountyCard key={b.id} bounty={b} onSubmit={handleSubmitWork} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-[#0d1424]/40 rounded-3xl border border-dashed border-[rgba(59,130,246,0.15)]">
            <div className="w-20 h-20 border-2 border-dashed border-[#6b7a99] rounded-full flex items-center justify-center mb-6 opacity-40">
              <span className="text-4xl text-[#6b7a99]">?</span>
            </div>
            <h3 className="text-2xl font-black text-[#6b7a99] mb-2 tracking-tight">No bounties found</h3>
            <p className="text-[#6b7a99] font-medium">Be the first to post a new challenge!</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[#00d4ff] font-bold hover:underline"
            >
              Post First Bounty →
            </button>
          </div>
        )}
      </main>

      {/* MODAL & TOAST */}
      <BountyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPost={handlePostBounty} 
      />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
