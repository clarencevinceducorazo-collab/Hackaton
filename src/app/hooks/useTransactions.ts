'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { loadTransactions, saveTransactions } from '../lib/storage';

/**
 * @fileOverview Hook for tracking session-based blockchain transactions.
 */

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  const addTransaction = (tx: Transaction) => {
    const next = [tx, ...transactions];
    setTransactions(next);
    saveTransactions(next);
  };

  return { transactions, addTransaction };
}
