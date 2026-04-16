// src/components/EmptyState.tsx
import React from 'react';
import Link from 'next/link';

interface Props {
  message?: string;
}

export default function EmptyState({ message = 'No wishes found' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#1e1e2e] rounded-3xl">
      <div className="w-20 h-20 bg-[#12121a] border border-[#1e1e2e] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/50">
        <svg
          className="w-10 h-10 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>
      <p className="text-gray-400 mb-8 max-w-sm">
        Be the first to create a wish on WishPool and start your crowdfunding journey!
      </p>
      <Link
        href="/create-wish"
        className="px-8 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#f59e0b]/20"
      >
        <span>Create a Wish</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
