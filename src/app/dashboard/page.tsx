// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Wish } from '@/types';
import WishCard from '@/components/WishCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function DashboardPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const address = window.sessionStorage.getItem('wishpool_address');
    if (address) {
      setUserAddress(address);
      fetchMyWishes(address);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyWishes = async (address: string) => {
    try {
      const res = await fetch(`/api/wishes?creatorAddress=${address}`);
      const data = await res.json();
      setWishes(data);
    } catch (error) {
      console.error('Error fetching my wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wish? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-address': userAddress || '',
        },
      });

      if (res.ok) {
        setWishes(wishes.filter((w) => w._id !== id));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete wish');
      }
    } catch (error) {
      console.error('Error deleting wish:', error);
      alert('An error occurred while deleting the wish');
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;

  if (!userAddress) {
    return (
      <div className="py-20 text-center space-y-6">
        <h2 className="text-3xl font-bold font-space text-white">Please Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your Freighter wallet to view and manage your wishes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-space text-white">My Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage your wishes and track funding progress.</p>
        </div>
        <Link 
          href="/create"
          className="hidden md:block px-8 py-4 bg-[#f59e0b] text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f59e0b]/20"
        >
          Create New Wish
        </Link>
      </div>

      {wishes.length === 0 ? (
        <EmptyState 
          message="You haven't created any wishes yet." 
          actionLabel="Create Wish" 
          onAction={() => window.location.href = '/create'} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishes.map((wish) => (
            <div key={wish._id} className="relative group">
              <WishCard wish={wish} />
              <button
                onClick={() => handleDelete(wish._id)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                title="Delete Wish"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
