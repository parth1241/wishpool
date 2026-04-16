// src/components/SkeletonCard.tsx
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-6 bg-[#1e1e2e] rounded w-1/2"></div>
        <div className="h-4 bg-[#1e1e2e] rounded w-16"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-[#1e1e2e] rounded w-full"></div>
        <div className="h-3 bg-[#1e1e2e] rounded w-3/4"></div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full bg-[#1e1e2e]"></div>
        <div className="h-3 bg-[#1e1e2e] rounded w-24"></div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <div className="h-2 bg-[#1e1e2e] rounded w-12"></div>
          <div className="h-2 bg-[#1e1e2e] rounded w-10"></div>
        </div>
        <div className="h-4 bg-[#1e1e2e] rounded-full w-full"></div>
      </div>

      <div className="flex justify-between items-center border-t border-[#1e1e2e] pt-4">
        <div className="h-4 bg-[#1e1e2e] rounded w-28"></div>
        <div className="h-8 bg-[#1e1e2e] rounded w-24"></div>
      </div>
    </div>
  );
}
