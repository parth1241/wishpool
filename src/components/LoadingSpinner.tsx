// src/components/LoadingSpinner.tsx
import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: Props) {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-[3px]',
  };

  return (
    <div className="flex justify-center items-center relative">
      <div
        className={`${sizeMap[size]} border-white/5 border-t-[#f59e0b] rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.2)]`}
      />
      <div
        className={`${sizeMap[size]} border-transparent border-t-[#f59e0b] rounded-full animate-pulse absolute opacity-30`}
      />
    </div>
  );
}
