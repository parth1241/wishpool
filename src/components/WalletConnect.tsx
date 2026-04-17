// src/components/WalletConnect.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { isConnected, getPublicKey, requestAccess } from '@stellar/freighter-api';
import { truncateAddress } from '@/lib/utils';

interface Props {
  onConnect?: (address: string) => void;
}

export default function WalletConnect({ onConnect }: Props) {
  const [address, setAddress] = useState<string>('');
  const [hasFreighter, setHasFreighter] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [diag, setDiag] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await new Promise(r => setTimeout(r, 1000));
      const connected = await isConnected();
      setDiag(connected ? 'Detected' : 'Searching...');
      
      if (connected) {
        const pubKey = await getPublicKey();
        if (pubKey) {
          setAddress(pubKey);
          window.sessionStorage.setItem('wishpool_address', pubKey);
          onConnect?.(pubKey);
        }
      }
    } catch (e) {
      console.warn('Background check error:', e);
    }
  };

  const handleConnect = async () => {
    setIsChecking(true);
    setErrorMsg('');
    setDiag('Initializing...');
    
    try {
      // 1. Direct check for window object
      const freighter = (window as any).freighter;
      if (!freighter) {
        setDiag('No window.freighter found');
        const connected = await isConnected().catch(() => false);
        if (!connected) {
          setHasFreighter(false);
          return;
        }
      }

      setHasFreighter(true);
      setDiag('Requesting access...');

      // 2. Request Access with better error capture
      try {
        const pubKey = await requestAccess();
        if (pubKey) {
          setAddress(pubKey);
          window.sessionStorage.setItem('wishpool_address', pubKey);
          onConnect?.(pubKey);
        } else {
          setErrorMsg('Access denied or cancelled');
        }
      } catch (err: any) {
        console.error('requestAccess failed:', err);
        if (err.message?.includes('Receiving end')) {
          setErrorMsg('Browser Conflict Detected. Please RESTART Chrome.');
        } else {
          setErrorMsg(`Error: ${err.message || 'Connection failed'}`);
        }
      }
    } catch (error: any) {
      setErrorMsg('Critical connection error');
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDisconnect = () => {
    setAddress('');
    window.sessionStorage.removeItem('wishpool_address');
    onConnect?.('');
  };

  if (!hasFreighter) {
    return (
      <div className="text-center space-y-2">
        <a
          href="https://www.freighter.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-[#f59e0b] text-black font-bold rounded-lg hover:opacity-90 transition-opacity inline-block"
        >
          Install Freighter
        </a>
        <p className="text-[10px] text-red-500 font-mono">Freighter not found in this browser</p>
        <button 
          onClick={() => setHasFreighter(true)}
          className="block mx-auto text-[10px] text-gray-500 underline"
        >
          I have it installed, check again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {address ? (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-gray-400 font-mono text-sm block">
              {truncateAddress(address)}
            </span>
            <span className="text-[9px] text-green-500 font-mono uppercase">Connected</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 border border-[#1e1e2e] text-xs text-white rounded hover:bg-red-500/20 hover:border-red-500/50 transition-all font-mono"
          >
            OUT
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleConnect}
            disabled={isChecking}
            className="px-8 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all min-w-[180px] disabled:opacity-50 shadow-lg shadow-[#f59e0b]/20"
          >
            {isChecking ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>{diag}</span>
              </div>
            ) : (
              'Connect Wallet'
            )}
          </button>
          
          {errorMsg && (
            <div className="text-[10px] text-red-400 font-mono bg-red-400/10 px-3 py-1 rounded border border-red-400/20 animate-pulse mt-2">
              ⚠️ {errorMsg}
            </div>
          )}
          
          {!isChecking && !errorMsg && diag && (
            <div className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">
              Status: {diag}
            </div>
          )}
        </>
      )}
    </div>
  );
}
