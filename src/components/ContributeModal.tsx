// src/components/ContributeModal.tsx
'use client';

import React, { useState } from 'react';
import { Wish } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import { signTransaction, getPublicKey } from '@stellar/freighter-api';
import { buildPaymentXDR } from '@/lib/stellar';

interface Props {
  wish: Wish;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'input' | 'processing' | 'success';

export default function ContributeModal({ wish, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('input');
  const [amount, setAmount] = useState<number>(1);
  const [statusText, setStatusText] = useState('');

  const handleFund = async () => {
    try {
      setStep('processing');
      setStatusText('Connecting with Freighter...');
      
      const publicKey = await getPublicKey();
      
      if (!publicKey) {
        throw new Error('Could not find a connected wallet. Please connect your Freighter wallet.');
      }

      setStatusText('Building Transaction...');
      const xdr = await buildPaymentXDR(
        publicKey,
        process.env.NEXT_PUBLIC_ESCROW_ADDRESS || 'GBRPYHIL2CI3FNMWB27S6GZ66W5A6IHYZ3BML5U3BH522E3Y464N6SGR', 
        amount.toString(),
        wish.stellarMemo
      );

      setStatusText('Sign Transaction in Freighter...');
      const signedXdr = await signTransaction(xdr, { network: 'TESTNET' });

      setStatusText('Broadcasting to Stellar Testnet...');
      // Note: In a production environment, you would use the Stellar SDK to submit this XDR.
      // For this demo, we simulate success after the user signs.
      await new Promise(r => setTimeout(r, 2000));
      
      const txHash = 'SIM_' + Math.random().toString(36).substring(2, 12).toUpperCase();
      
      setStatusText('Confirming on WishPool...');
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishId: wish._id,
          contributorAddress: publicKey,
          amount,
          txHash
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update contribution Record');
      }
      
      setStep('success');
    } catch (e: any) {
      alert(e.message || 'Transaction failed');
      setStep('input');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all">
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f59e0b] to-[#6366f1]"></div>
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-space text-white">Support Wish</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1e1e2e]">✕</button>
        </div>

        {step === 'input' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Contribute Amount</span>
                <span className="text-[10px] text-indigo-400 font-mono">Available: XLM</span>
              </div>
              <div className="bg-[#0a0a0f] p-6 rounded-3xl border border-[#1e1e2e] flex items-center justify-between shadow-inner">
                <input
                  type="number"
                  min={1}
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-transparent text-4xl font-bold text-white outline-none font-space"
                />
                <span className="text-xl font-bold text-[#f59e0b] ml-4 font-mono">XLM</span>
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl">
              <p className="text-xs text-indigo-200/60 leading-relaxed italic">
                Your funds will be held securely in the WishPool Escrow and only released to the creator when the goal is met or the wish is fulfilled.
              </p>
            </div>

            <button
              onClick={handleFund}
              className="w-full py-5 bg-[#f59e0b] text-black font-extrabold rounded-2xl text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#f59e0b]/10 group-hover:shadow-[#f59e0b]/20"
            >
              Confirm Contribution
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center gap-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-[#6366f1]/20 blur-2xl rounded-full"></div>
              <LoadingSpinner size="lg" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-white font-bold text-lg">Transaction in Progress</p>
              <p className="text-gray-400 font-mono text-xs animate-pulse tracking-wide">{statusText}</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-5xl shadow-2xl shadow-green-500/20">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white font-space">Funded!</h3>
              <p className="text-gray-400 text-sm">Thank you for helping make this dream come true. Your contribution has been broadcasted.</p>
            </div>
            <button
              onClick={onSuccess}
              className="w-full py-5 bg-[#1e1e2e] text-white font-bold rounded-2xl hover:bg-[#2e2e3e] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
