'use client';
import { useState, useEffect } from 'react';
import { Bounty } from '../types/bounty';

const STORAGE_KEY = 'bounty_board_data';

const INITIAL_BOUNTIES: Bounty[] = [
  {
    id: '1',
    title: 'Write a Sepolia ETH Explainer',
    description: 'Create a 300-word blog post explaining why Sepolia is the best testnet for developers.',
    requirements: 'Must mention free ETH from faucets, security, and smart contract testing. Tone should be technical.',
    reward: 0.001,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design a Hero Component',
    description: 'Create a clean, futuristic hero section using Tailwind CSS.',
    requirements: 'Must include a CTA, background grid, and be responsive.',
    reward: 0.0025,
    status: 'IN_REVIEW',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Audit a Simple Smart Contract',
    description: 'Find reentrancy vulnerabilities in the provided Solidity code.',
    requirements: 'Provide a short report of findings and fixed code.',
    reward: 0.005,
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
