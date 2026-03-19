import { Bounty, Transaction } from '../types';

/**
 * @fileOverview LocalStorage persistence layer for Hackathon usage.
 */

const KEYS = {
  BOUNTIES: 'bounty_board_data',
  TRANSACTIONS: 'bounty_tx_history',
};

const SEED_BOUNTIES: Bounty[] = [
  {
    id: 'seed-1',
    title: "Write a Base L2 technical explainer",
    description: "Create educational content about Base blockchain for newcomers.",
    requirements: "1. Must be minimum 150 words.\n2. Must explain what Layer 2 means.\n3. Must mention low transaction fees.\n4. Must explain EVM compatibility.\n5. Must be written in plain English.",
    reward: 10,
    status: 'OPEN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    title: "Debug a Solidity reentrancy vulnerability",
    description: "Fix a security bug in a provided smart contract function.",
    requirements: "1. Identify the reentrancy attack vector.\n2. Provide the corrected code block.\n3. Explain the checks-effects-interactions pattern.\n4. Include a developer comment on why the fix is safe.",
    reward: 25,
    status: 'IN_REVIEW',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'seed-3',
    title: "Design a dark-theme landing hero section",
    description: "Create a modern hero component using Tailwind CSS utility classes.",
    requirements: "1. Use background color #04070f.\n2. Include a Syne font headline.\n3. Add a CTA button with electric blue hover glow.\n4. Must be responsive for mobile.",
    reward: 15,
    status: 'PAID',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export function saveBounties(bounties: Bounty[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.BOUNTIES, JSON.stringify(bounties));
}

export function loadBounties(): Bounty[] {
  if (typeof window === 'undefined') return SEED_BOUNTIES;
  const saved = localStorage.getItem(KEYS.BOUNTIES);
  return saved ? JSON.parse(saved) : SEED_BOUNTIES;
}

export function saveTransactions(txs: Transaction[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
}

export function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(KEYS.TRANSACTIONS);
  return saved ? JSON.parse(saved) : [];
}
