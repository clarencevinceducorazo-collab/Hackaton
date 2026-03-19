'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

/**
 * @fileOverview Smart wallet button managing connection states and balance display.
 * Includes a 'mounted' check to prevent Next.js hydration errors.
 */

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Return a placeholder or skeleton during SSR to avoid mismatch
  if (!mounted) {
    return (
      <button className="px-6 py-2 border border-[#00d4ff] text-[#00d4ff] text-xs font-bold opacity-50 cursor-not-allowed">
        Connect Wallet
      </button>
    );
  }

  // STATE: Connecting
  if (isConnecting) {
    return (
      <button disabled className="flex items-center gap-2 px-5 py-2 border border-[#00d4ff]/30 text-[#00d4ff] rounded-lg text-xs font-bold opacity-70">
        <div className="w-3 h-3 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
        Connecting...
      </button>
    );
  }

  // STATE: Connected
  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex flex-col items-end px-4 py-1.5 border border-[#10b981]/30 bg-[#10b981]/5 rounded-lg transition-colors hover:bg-[#10b981]/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="font-mono text-xs font-bold text-[#eef2ff]">{truncateAddress(address)}</span>
          </div>
          <span className="text-[10px] text-[#6b7a99] font-mono">
            {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} {balance?.symbol} (testnet)
          </span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-[#0d1424] border border-[rgba(59,130,246,0.2)] rounded-xl shadow-2xl z-[200] overflow-hidden animate-fade-in">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-3 text-xs font-bold text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // STATE: Disconnected
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff] hover:text-[#050810] text-xs font-bold transition-all duration-300"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        Connect Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0d1424] w-full max-w-sm rounded-2xl border border-[rgba(59,130,246,0.2)] p-8 modal-enter">
            <h2 className="text-xl font-black text-[#eef2ff] mb-2 tracking-tight">Connect Wallet</h2>
            <p className="text-sm text-[#6b7a99] mb-6">Choose Base Sepolia testnet wallet</p>
            
            <div className="flex flex-col gap-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    setShowModal(false);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-[#050810] border border-[rgba(59,130,246,0.15)] rounded-xl hover:border-[#00d4ff] hover:bg-[#00d4ff]/5 transition-all group"
                >
                  <span className="font-bold text-sm text-[#eef2ff] group-hover:text-[#00d4ff]">
                    {connector.name}
                  </span>
                  <span className="text-lg">
                    {connector.name.toLowerCase().includes('coinbase') ? '🔵' : '🦊'}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-[11px] text-center text-[#6b7a99]">
              No wallet found? Install{' '}
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] hover:underline">
                MetaMask
              </a>
            </p>

            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#6b7a99] hover:text-[#eef2ff] p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
