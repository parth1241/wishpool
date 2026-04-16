// src/components/LoadingSpinner.tsx
import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: Props) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeMap[size]} border-[#1e1e2e] border-t-[#f59e0b] rounded-full animate-spin`}
      />
    </div>
  );
}
