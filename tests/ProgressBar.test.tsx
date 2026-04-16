// tests/ProgressBar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '@/components/ProgressBar';

describe('ProgressBar Component', () => {
  test('renders without crashing', () => {
    render(<ProgressBar percent={50} />);
  });

  test('shows 50% text when percent=50', () => {
    render(<ProgressBar percent={50} />);
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  test('shows 100% when percent=100', () => {
    render(<ProgressBar percent={100} />);
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });
});
