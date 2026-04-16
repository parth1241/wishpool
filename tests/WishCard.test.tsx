// tests/WishCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import WishCard from '@/components/WishCard';
import { Wish } from '@/types';

// Mock the Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockWish: Wish = {
  _id: '123',
  title: 'Test Fundraising Wish',
  description: 'Helping people in need for this test case.',
  creatorAddress: 'GABC1234567890WXYZ',
  targetAmount: 1000,
  raisedAmount: 500,
  deadline: new Date('2030-01-01'),
  status: 'active',
  stellarMemo: 'WISH001',
  contributions: [],
  createdAt: new Date()
};

describe('WishCard Component', () => {
  test('renders the wish title', () => {
    render(<WishCard wish={mockWish} />);
    expect(screen.getByText('Test Fundraising Wish')).toBeInTheDocument();
  });

  test('renders the formatted target XLM amount', () => {
    render(<WishCard wish={mockWish} />);
    expect(screen.getByText('1000.00 XLM')).toBeInTheDocument();
  });

  test('renders the View Wish link', () => {
    render(<WishCard wish={mockWish} />);
    const link = screen.getByText('View Wish');
    expect(link.closest('a')).toHaveAttribute('href', '/wish/123');
  });
});
