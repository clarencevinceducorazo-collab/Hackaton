/**
 * @fileOverview Types for the AI Judge evaluation system.
 */

export type EvaluationRequest = {
  bountyId: string;
  bountyTitle: string;
  bountyDescription: string;
  bountyRequirements: string;
  submission: string;
  submissionId: string;
};

export type EvaluationResult = {
  verdict: 'APPROVED' | 'REJECTED';
  reason: string;
  confidence: number;
  criteriaChecked: string[];
  missingCriteria: string[];
  evaluatedAt: string;
  model: string;
};

export interface VerdictDisplayProps {
  result: EvaluationResult;
  bountyTitle: string;
  onClose: () => void;
  onClaimReward?: () => void;
}
