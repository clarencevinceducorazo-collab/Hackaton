'use client';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-[#10b981] border-[#10b981]/50',
    error: 'bg-[#ef4444] border-[#ef4444]/50',
    info: 'bg-[#3b82f6] border-[#3b82f6]/50',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[2000] px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-4 toast-enter ${styles[type]}`}>
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
        {icons[type]}
      </div>
      <p className="text-white font-bold text-sm tracking-wide">{message}</p>
    </div>
  );
}
