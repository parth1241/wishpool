// src/app/wish/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Wish } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import CountdownTimer from '@/components/CountdownTimer';
import ContributeModal from '@/components/ContributeModal';
import { formatXLM, truncateAddress, getProgressPercent, getStatusColor } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function WishDetail() {
  const { id } = useParams();
  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWish();
  }, [id]);

  const fetchWish = async () => {
    try {
      const res = await fetch(`/api/wishes/${id}`);
      const data = await res.json();
      setWish(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  if (!wish) return <div className="text-center py-20 text-gray-400">Wish not found.</div>;

  const percent = getProgressPercent(wish.raisedAmount, wish.targetAmount);

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 px-4">
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4 flex-1">
            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${getStatusColor(wish.status)} border-current bg-opacity-10 font-mono tracking-widest`}>
              {wish.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-space leading-tight text-white">{wish.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">{wish.description}</p>
          </div>
          <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-[#1e1e2e] min-w-[280px] space-y-4 shadow-inner">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-mono">Target</span>
              <span className="font-bold text-white">{formatXLM(wish.targetAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-mono">Raised</span>
              <span className="font-bold text-[#f59e0b]">{formatXLM(wish.raisedAmount)}</span>
            </div>
            <hr className="border-[#1e1e2e]" />
            <CountdownTimer deadline={wish.deadline} />
          </div>
        </div>

        <div className="space-y-4">
          <ProgressBar percent={percent} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[#1e1e2e] pt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#6366f1]/20 flex items-center justify-center font-bold text-[#6366f1] text-lg">
              {wish.creatorAddress.slice(2, 3).toUpperCase()}
            </div>
            <div className="text-sm">
              <span className="text-gray-500 block text-[10px] uppercase font-mono mb-1">Created By</span>
              <a 
                href={`https://stellar.expert/explorer/testnet/account/${wish.creatorAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f59e0b] font-mono hover:underline font-bold"
              >
                {truncateAddress(wish.creatorAddress)}
              </a>
            </div>
          </div>
          <button 
            disabled={wish.status !== 'active'}
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none px-12 py-4 bg-[#f59e0b] text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#f59e0b]/20"
          >
            Fund This Wish
          </button>
        </div>
      </div>

      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-3xl p-8 md:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold font-space text-white">Recent Contributions</h3>
          <span className="bg-[#1e1e2e] text-gray-400 text-xs px-3 py-1 rounded-full font-mono">
            {wish.contributions.length}
          </span>
        </div>
        <div className="overflow-x-auto min-h-[200px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase font-mono border-b border-[#1e1e2e]">
                <th className="pb-4 font-normal tracking-wider">Contributor</th>
                <th className="pb-4 font-normal tracking-wider">Amount</th>
                <th className="pb-4 font-normal tracking-wider">Transaction</th>
                <th className="pb-4 font-normal tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {wish.contributions.map((c, i) => (
                <tr key={i} className="border-b border-[#1e1e2e]/30 last:border-0 hover:bg-[#0a0a0f]/50 transition-colors">
                  <td className="py-5 font-mono text-gray-300">{truncateAddress(c.contributorAddress)}</td>
                  <td className="py-5 font-bold text-white">{c.amount} XLM</td>
                  <td className="py-5">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${c.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6366f1] hover:text-[#f59e0b] flex items-center gap-1 font-mono text-xs transition-colors"
                    >
                      {c.txHash.slice(0, 12)}...
                    </a>
                  </td>
                  <td className="py-5 text-gray-500 text-xs">{new Date(c.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
              {wish.contributions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-500 font-mono italic">
                    No contributions yet. Be the first to fund this dream!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ContributeModal 
          wish={wish} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            fetchWish();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
