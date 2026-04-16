// src/components/WishCard.tsx
import React from 'react';
import Link from 'next/link';
import { Wish } from '@/types';
import ProgressBar from './ProgressBar';
import CountdownTimer from './CountdownTimer';
import { truncateAddress, getProgressPercent, getStatusColor } from '@/lib/utils';

interface Props {
  wish: Wish;
}

export default function WishCard({ wish }: Props) {
  const percent = getProgressPercent(wish.raisedAmount, wish.targetAmount);
  const statusColor = getStatusColor(wish.status);

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#f59e0b]/30 transition-all group active:scale-[0.98]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-[#f59e0b] transition-colors line-clamp-1">
          {wish.title}
        </h3>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-current ${statusColor} bg-opacity-10`}>
          {wish.status}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
        {wish.description}
      </p>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[10px] font-bold text-[#6366f1]">
          {wish.creatorAddress.slice(2, 3).toUpperCase()}
        </div>
        <span className="text-xs text-gray-500 font-mono">
          by {truncateAddress(wish.creatorAddress)}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <ProgressBar percent={percent} />
        <div className="flex justify-between text-xs font-mono">
          <div className="flex flex-col">
            <span className="text-gray-500">Raised</span>
            <span className="text-white font-bold">{wish.raisedAmount.toFixed(2)} XLM</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500">Target</span>
            <span className="text-white font-bold">{wish.targetAmount.toFixed(2)} XLM</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#1e1e2e] pt-4">
        <CountdownTimer deadline={wish.deadline} />
        <Link 
          href={`/wish/${wish._id}`}
          className="px-4 py-2 bg-[#6366f1] text-white text-xs font-bold rounded shadow-lg shadow-[#6366f1]/20 hover:bg-[#6366f1]/90 transition-all"
        >
          View Wish
        </Link>
      </div>
    </div>
  );
}
