// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Wish } from '@/types';
import WishCard from '@/components/WishCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function DashboardPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [refundingIds, setRefundingIds] = useState<string[]>([]);

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

  const handleEditInit = (wish: Wish) => {
    setEditingId(wish._id);
    setEditForm({ title: wish.title, description: wish.description });
  };

  const handleEditSubmit = async (id: string) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-address': userAddress || '',
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setWishes(wishes.map(w => w._id === id ? { ...w, ...editForm } : w));
        setEditingId(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update wish');
      }
    } catch (error) {
      console.error('Error updating wish:', error);
      alert('An error occurred while updating the wish');
    }
  };

  const handleRefund = async (id: string) => {
    if (!confirm('This will trigger XLM refunds from the escrow to all contributors of this wish. Proceed?')) return;

    setRefundingIds([...refundingIds, id]);
    try {
      const res = await fetch(`/api/wishes/${id}/refund`, {
        method: 'POST',
        headers: {
          'x-user-address': userAddress || '',
        },
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setWishes(wishes.map(w => w._id === id ? { ...w, status: 'refunded' as const } : w));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to process refunds');
      }
    } catch (error) {
      console.error('Error refunding wish:', error);
      alert('An error occurred during the refund process');
    } finally {
      setRefundingIds(refundingIds.filter(rid => rid !== id));
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
            <div key={wish._id} className="relative group flex flex-col gap-4">
              <div className="relative">
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

              {/* Management Controls */}
              <div className="px-4 pb-4 space-y-4">
                {editingId === wish._id ? (
                  <div className="bg-[#12121a] border border-[#f59e0b]/30 p-4 rounded-2xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-2 text-white text-sm"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Title"
                    />
                    <textarea
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-2 text-white text-xs h-20"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditSubmit(wish._id)}
                        className="flex-1 py-2 bg-[#f59e0b] text-black text-xs font-bold rounded-lg"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {wish.status === 'active' && (
                      <button
                        onClick={() => handleEditInit(wish)}
                        className="flex-1 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        Edit Wish
                      </button>
                    )}
                    {wish.status === 'expired' && (
                      <button
                        onClick={() => handleRefund(wish._id)}
                        disabled={refundingIds.includes(wish._id)}
                        className="flex-1 py-2 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 rounded-xl text-xs font-bold hover:bg-[#f59e0b] hover:text-black transition-all disabled:opacity-50"
                      >
                        {refundingIds.includes(wish._id) ? 'Processing Refunds...' : 'Refund Contributors'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
