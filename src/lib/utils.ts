// src/lib/utils.ts
import { WishStatus } from '@/types';

export function formatXLM(amount: number): string {
  return `${amount.toFixed(2)} XLM`;
}

export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export function isExpired(deadline: Date): boolean {
  return new Date() > new Date(deadline);
}

export function getProgressPercent(raised: number, target: number): number {
  if (target <= 0) return 0;
  const percent = (raised / target) * 100;
  return Math.min(percent, 100);
}

export function getStatusColor(status: WishStatus): string {
  switch (status) {
    case 'active':
      return 'text-primary';
    case 'funded':
      return 'text-success';
    case 'expired':
      return 'text-danger';
    case 'claimed':
      return 'text-secondary';
    case 'refunded':
      return 'text-gray-400';
    default:
      return 'text-white';
  }
}

export function formatTimeLeft(deadline: Date): string {
  const diff = new Date(deadline).getTime() - new Date().getTime();
  if (diff <= 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
}
