/**
 * @fileOverview Defines the structure for tracking blockchain transactions in the session.
 */

export interface TxEntry {
  txHash: string;
  amount: number;
  recipient: string;
  timestamp: string;
  bountyTitle: string;
  status: 'confirmed' | 'pending' | 'failed';
}
