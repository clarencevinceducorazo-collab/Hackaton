export interface Bounty {
  id: string;
  title: string;
  description: string;
  requirements: string;
  reward: number;
  status: 'OPEN' | 'IN_REVIEW' | 'PAID';
  createdAt: string;
  creatorAddress?: string;
}
