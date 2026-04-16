// src/types/index.ts
export type WishStatus = 'active' | 'funded' | 'expired' | 'claimed' | 'refunded';

export interface Contribution {
  contributorAddress: string;
  amount: number;
  txHash: string;
  timestamp: Date;
}

export interface Wish {
  _id: string;
  title: string;
  description: string;
  creatorAddress: string;
  targetAmount: number;
  raisedAmount: number;
  deadline: Date;
  status: WishStatus;
  contributions: Contribution[];
  createdAt: Date;
  stellarMemo: string;
}

export interface CreateWishInput {
  title: string;
  description: string;
  targetAmount: number;
  deadline: string;
  creatorAddress: string;
}

export interface ContributeInput {
  wishId: string;
  contributorAddress: string;
  amount: number;
  txHash: string;
}
