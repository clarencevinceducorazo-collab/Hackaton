'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastType } from '../types';

/**
 * @fileOverview Toast notification system.
 */

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-[#10b981] border-[#10b981]/50 text-white',
    error: 'bg-[#ef4444] border-[#ef4444]/50 text-white',
    info: 'bg-[#3b82f6] border-[#3b82f6]/50 text-white',
    warning: 'bg-[#f59e0b] border-[#f59e0b]/50 text-white',
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertCircle size={18} />,
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl animate-toast-enter ${styles[type]}`}>
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}
