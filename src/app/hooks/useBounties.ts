'use client';
import { useState, useEffect } from 'react';
import { Bounty } from '../types/bounty';

const STORAGE_KEY = 'bounty_board_data';

const INITIAL_BOUNTIES: Bounty[] = [
  {
    id: '1',
    title: 'Write a Base L2 Explainer',
    description: 'Create a 300-word blog post explaining why Base is the best L2 for developers.',
    requirements: 'Must mention low fees, security, and Coinbase integration. The tone should be technical but accessible.',
    reward: 10,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design a Hero Component',
    description: 'Create a clean, futuristic hero section using Tailwind CSS for an AI platform.',
    requirements: 'Must include a CTA, background grid, and be responsive. Code must be clean and documented.',
    reward: 25,
    status: 'IN_REVIEW',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Audit a Simple Smart Contract',
    description: 'Find any reentrancy vulnerabilities in the provided Solidity code for a staking pool.',
    requirements: 'Provide a short report of findings and fixed code. Explain the attack vector clearly.',
    reward: 50,
    status: 'PAID',
    createdAt: new Date().toISOString(),
  },
];

export function useBounties() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBounties(JSON.parse(saved));
      } catch (e) {
        setBounties(INITIAL_BOUNTIES);
      }
    } else {
      setBounties(INITIAL_BOUNTIES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bounties));
    }
  }, [bounties, isLoaded]);

  const addBounty = (bounty: Omit<Bounty, 'id' | 'createdAt'>) => {
    const newBounty: Bounty = {
      ...bounty,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setBounties((prev) => [newBounty, ...prev]);
  };

  const updateBountyStatus = (id: string, status: Bounty['status']) => {
    setBounties((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBounty = (id: string) => {
    setBounties((prev) => prev.filter((b) => b.id !== id));
  };

  return { bounties, addBounty, updateBountyStatus, deleteBounty, isLoaded };
}
