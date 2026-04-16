// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wish } from '@/types';
import WishCard from '@/components/WishCard';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';

export default function Home() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchWishes();
  }, [statusFilter]);

  const fetchWishes = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/api/wishes' : `/api/wishes?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setWishes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['all', 'active', 'funded', 'expired'];

  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 pt-10 px-4">
        <h1 className="text-5xl md:text-7xl font-bold font-space leading-tight">
          Fund Dreams on<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#6366f1]">
            the Stellar Blockchain
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Create a wish, share it with the world, and watch your community fund your dreams using Stellar XLM. Transparent, decentralized, and fast.
        </p>
        <div className="pt-4">
          <Link
            href="/create"
            className="px-8 py-4 bg-[#f59e0b] text-black font-bold rounded-xl text-lg hover:scale-105 transition-transform inline-block shadow-lg shadow-[#f59e0b]/20"
          >
            Create a Wish
          </Link>
        </div>
      </section>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all border ${
                statusFilter === tab
                  ? 'bg-[#f59e0b] border-[#f59e0b] text-black'
                  : 'bg-transparent border-[#1e1e2e] text-gray-400 hover:border-[#f59e0b]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : wishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {wishes.map((wish) => (
              <WishCard key={wish._id} wish={wish} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
