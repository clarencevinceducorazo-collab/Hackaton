export interface Submission {
  id: string;
  bountyId: string;
  submitterAddress: string;
  githubRepo: string;
  description: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
