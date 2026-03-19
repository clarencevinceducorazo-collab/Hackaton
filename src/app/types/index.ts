/**
 * @fileOverview Unified TypeScript interfaces for the Bounty Board.
 */

export interface Bounty {
  id: string;
  title: string;
  description: string;
  requirements: string;
  reward: number; // Simulated USDC (sent as testnet ETH)
  status: 'OPEN' | 'IN_REVIEW' | 'PAID' | 'REJECTED';
  createdAt: string;
  creatorAddress?: string;
}

export interface Submission {
  id: string;
  bountyId: string;
  content: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface EvaluationRequest {
  bountyId: string;
  bountyTitle: string;
  bountyDescription: string;
  bountyRequirements: string;
  submission: string;
  submissionId: string;
}

export interface EvaluationResult {
  verdict: 'APPROVED' | 'REJECTED';
  reason: string;
  confidence: number;
  criteriaChecked: string[];
  missingCriteria: string[];
  evaluatedAt: string;
  evaluationMs: number;
  model: string;
}

export interface Transaction {
  txHash: string;
  amount: number;
  recipient: string;
  timestamp: string;
  bountyTitle: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
