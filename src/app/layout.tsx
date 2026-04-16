// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import WalletConnect from '@/components/WalletConnect';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'WishPool | Fund Dreams on Stellar',
  description: 'A decentralized crowdfunding platform on the Stellar blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#0a0a0f] text-white min-h-screen`}>
        <nav className="border-b border-[#1e1e2e] py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-50">
          <Link href="/" className="text-2xl font-bold font-space text-[#f59e0b] flex items-center gap-2">
            WishPool <span className="text-[#6366f1]">✦</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link href="/" className="hover:text-[#f59e0b] transition-colors">Home</Link>
              <Link href="/dashboard" className="hover:text-[#f59e0b] transition-colors">Dashboard</Link>
              <Link href="/create" className="hover:text-[#f59e0b] transition-colors">Create</Link>
            </div>
            <WalletConnect />
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          {children}
        </main>
        <footer className="border-t border-[#1e1e2e] py-10 text-center text-gray-500 text-sm">
          <p>© 2024 WishPool. Built on Stellar Testnet.</p>
        </footer>
      </body>
    </html>
  );
}
