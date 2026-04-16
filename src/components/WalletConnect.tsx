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

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isConnected();
      if (connected) {
        const pubKey = await getPublicKey();
        if (pubKey) {
          setAddress(pubKey);
          window.sessionStorage.setItem('wishpool_address', pubKey);
          onConnect?.(pubKey);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = async () => {
    try {
      const connected = await isConnected();
      if (!connected) {
        setHasFreighter(false);
        return;
      }

      const pubKey = await requestAccess();
      if (pubKey) {
        setAddress(pubKey);
        window.sessionStorage.setItem('wishpool_address', pubKey);
        onConnect?.(pubKey);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    setAddress('');
    window.sessionStorage.removeItem('wishpool_address');
    onConnect?.('');
  };

  if (!hasFreighter) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-[#f59e0b] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
      >
        Install Freighter
      </a>
    );
  }

  return (
    <div>
      {address ? (
        <div className="flex items-center gap-3">
          <span className="text-gray-400 font-mono text-sm underline decoration-[#f59e0b]">
            {truncateAddress(address)}
          </span>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 border border-[#1e1e2e] text-xs text-white rounded hover:bg-[#1e1e2e] transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-6 py-2 bg-[#f59e0b] text-black font-bold rounded-lg hover:scale-105 active:scale-95 transition-all"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
