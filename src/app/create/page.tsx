// src/app/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WalletConnect from '@/components/WalletConnect';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CreateWish() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: 1,
    deadline: '',
  });

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description)) return;
    if (step === 2 && (!formData.targetAmount || !formData.deadline)) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!creatorAddress) return;
    try {
      setLoading(true);
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, creatorAddress }),
      });
      const data = await res.json();
      if (data._id) {
        router.push(`/wish/${data._id}`);
      }
    } catch (error) {
      console.error('Error creating wish:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-10">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#1e1e2e] -z-10"></div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
              step >= i ? 'bg-[#f59e0b] border-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20' : 'bg-[#0a0a0f] border-[#1e1e2e] text-gray-500'
            }`}
          >
            {i}
          </div>
        ))}
      </div>

      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-3xl p-8 shadow-2xl">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-space text-white">Tell your story</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-mono">Title</label>
              <input
                type="text"
                maxLength={80}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What are you wishing for?"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 text-white focus:border-[#f59e0b] outline-none transition-all"
              />
              <p className="text-right text-[10px] text-gray-500 mt-1 font-mono">{formData.title.length}/80</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-mono">Description</label>
              <textarea
                rows={5}
                maxLength={500}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Share more details about your wish..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 text-white focus:border-[#f59e0b] outline-none transition-all"
              />
              <p className="text-right text-[10px] text-gray-500 mt-1 font-mono">{formData.description.length}/500</p>
            </div>
            <button
              onClick={nextStep}
              disabled={!formData.title || !formData.description}
              className="w-full py-4 bg-[#6366f1] text-white font-bold rounded-xl disabled:opacity-50 hover:bg-[#6366f1]/90"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-space text-white">Set your goals</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-mono">Target Amount (XLM)</label>
              <input
                type="number"
                min={1}
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 text-white focus:border-[#f59e0b] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-mono">Deadline</label>
              <input
                type="date"
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 text-white focus:border-[#f59e0b] outline-none transition-all lg:appearance-none"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-4 border border-[#1e1e2e] text-white font-bold rounded-xl hover:bg-[#1e1e2e]">Back</button>
              <button
                onClick={nextStep}
                disabled={!formData.targetAmount || !formData.deadline}
                className="flex-1 py-4 bg-[#6366f1] text-white font-bold rounded-xl disabled:opacity-50 hover:bg-[#6366f1]/90"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold font-space text-white">Review & Launch</h2>
            <div className="bg-[#0a0a0f] p-6 rounded-2xl text-left space-y-4 border border-[#1e1e2e]">
              <div><span className="text-gray-500 text-[10px] uppercase font-mono block mb-1">Wish Title</span><p className="font-bold text-lg">{formData.title}</p></div>
              <div className="flex justify-between border-t border-[#1e1e2e] pt-4">
                <div><span className="text-gray-500 text-[10px] uppercase font-mono block mb-1">Goal</span><p className="font-bold text-[#f59e0b]">{formData.targetAmount} XLM</p></div>
                <div><span className="text-gray-500 text-[10px] uppercase font-mono block mb-1">Deadline</span><p className="font-bold">{formData.deadline}</p></div>
              </div>
            </div>
            {!creatorAddress ? (
              <div className="p-10 border-2 border-dashed border-[#1e1e2e] rounded-2xl bg-[#0a0a0f]">
                <p className="text-gray-400 mb-6 font-mono text-sm">You need to connect your wallet to publish</p>
                <div className="flex justify-center">
                  <WalletConnect onConnect={(addr) => setCreatorAddress(addr)} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-[#f59e0b] text-black font-bold rounded-xl text-lg flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#f59e0b]/10"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Publish Wish 🚀'}
                </button>
                <button onClick={prevStep} className="w-full text-xs text-gray-500 underline hover:text-gray-300">Change Details</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
