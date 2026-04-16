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
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 font-mono">Progress</span>
        <span className={`text-xs font-bold ${isFullyFunded ? 'text-green-500' : 'text-[#f59e0b]'}`}>
          {percent.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-[#1e1e2e] rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-black ${
            isFullyFunded ? 'bg-green-500' : 'bg-[#f59e0b]'
          } ${animated && !isFullyFunded ? 'animate-pulse' : ''}`}
          style={{ width: `${displayPercent}%` }}
        />
      </div>
    </div>
  );
}
