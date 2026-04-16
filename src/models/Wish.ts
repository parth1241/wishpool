// src/models/Wish.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Wish as IWish } from '@/types';

const ContributionSchema = new Schema({
  contributorAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const WishSchema = new Schema<IWish>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creatorAddress: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'funded', 'expired', 'claimed', 'refunded'], 
    default: 'active' 
  },
  stellarMemo: { type: String, required: true, unique: true },
  contributions: [ContributionSchema],
  payoutHash: { type: String },
}, { timestamps: true });

const Wish = models.Wish || model<IWish>('Wish', WishSchema);
export default Wish;
