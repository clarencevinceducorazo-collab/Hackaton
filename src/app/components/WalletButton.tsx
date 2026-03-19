'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { baseSepolia } from '../lib/wagmi-config';
import { LogOut, Wallet, X } from 'lucide-react';

/**
 * @fileOverview Smart wallet connector with dropdown and connection modal.
 */

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => setMounted(true), []);

  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId: baseSepolia.id });

  if (!mounted) return (
    <button className="px-6 py-2 border border-[#00d4ff]/30 text-[#00d4ff]/30 text-xs font-bold opacity-50 cursor-not-allowed">
      Connect Wallet
    </button>
  );

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (isConnecting) return (
    <div className="flex items-center gap-2 px-5 py-2 border border-[#00d4ff]/30 rounded text-[#00d4ff] text-xs font-bold">
      <div className="w-3 h-3 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      Connecting...
    </div>
  );

  if (isConnected && address) return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex flex-col items-end px-4 py-1.5 bg-[#0d1424] border border-[rgba(16,185,129,0.3)] rounded-lg hover:border-[#10b981] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
          <span className="text-xs font-mono font-bold text-[#eef2ff]">{truncate(address)}</span>
        </div>
        <span className="text-[10px] text-[#6b7a99] font-mono leading-none mt-1">
          {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-[#0d1424] border border-white/10 rounded-xl shadow-2xl z-[100] p-1 animate-fadeIn">
          <button 
            onClick={() => { disconnect(); setShowDropdown(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={14} /> Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="px-6 py-2 border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff] hover:text-[#04070f] text-xs font-bold transition-all duration-300 relative overflow-hidden group"
        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
      >
        Connect Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0d1424] w-full max-w-sm rounded-2xl border border-white/10 p-8 animate-modal-content">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[#6b7a99] hover:text-white"><X size={20}/></button>
            <h2 className="text-2xl font-black font-display text-[#eef2ff] mb-2">Connect Wallet</h2>
            <p className="text-sm text-[#6b7a99] mb-8 font-body">Choose a Base Sepolia testnet wallet</p>
            
            <div className="space-y-3">
              {connectors.map(connector => (
                <button
                  key={connector.id}
                  onClick={() => { connect({ connector }); setShowModal(false); }}
                  className="w-full flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-[#00d4ff] hover:bg-[#00d4ff]/5 transition-all group"
                >
                  <span className="font-bold text-[#eef2ff] group-hover:text-[#00d4ff]">{connector.name}</span>
                  <Wallet size={18} className="text-[#6b7a99] group-hover:text-[#00d4ff]" />
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-[#6b7a99] font-body leading-relaxed">
              No wallet found? Install <a href="https://metamask.io" target="_blank" className="text-[#00d4ff] hover:underline">MetaMask</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
