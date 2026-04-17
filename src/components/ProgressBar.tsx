// src/components/ProgressBar.tsx
import React from 'react';

interface Props {
  percent: number;
  animated?: boolean;
}

export default function ProgressBar({ percent, animated = true }: Props) {
  const displayPercent = Math.min(percent, 100);
  const isFullyFunded = percent >= 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400 font-mono tracking-wider uppercase">Funding Progress</span>
        <span className={`text-sm font-bold font-mono ${isFullyFunded ? 'text-green-400' : 'text-[#f59e0b]'} drop-shadow-sm`}>
          {percent.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-5 p-1 border border-white/10 shadow-inner overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
            isFullyFunded ? 'bg-green-500' : 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]'
          } ${animated && !isFullyFunded ? 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}`}
          style={{ width: `${displayPercent}%` }}
        >
          {animated && !isFullyFunded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          )}
        </div>
      </div>
    </div>
  );
}
