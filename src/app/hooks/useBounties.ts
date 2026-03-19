'use client';

import { useState, useEffect } from 'react';
import { Bounty } from '../types';
import { loadBounties, saveBounties } from '../lib/storage';

/**
 * @fileOverview State management hook for Bounties.
 */

export function useBounties() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setBounties(loadBounties());
    setIsMounted(true);
  }, []);

  const addBounty = (data: Omit<Bounty, 'id' | 'createdAt' | 'status'>) => {
    const newBounty: Bounty = {
      ...data,
      id: crypto.randomUUID(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    const next = [newBounty, ...bounties];
    setBounties(next);
    saveBounties(next);
  };

  const updateBountyStatus = (id: string, status: Bounty['status']) => {
    const next = bounties.map(b => b.id === id ? { ...b, status } : b);
    setBounties(next);
    saveBounties(next);
  };

  const deleteBounty = (id: string) => {
    const next = bounties.filter(b => b.id !== id);
    setBounties(next);
    saveBounties(next);
  };

  return { bounties, addBounty, updateBountyStatus, deleteBounty, isLoaded: isMounted };
}
