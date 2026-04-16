// tests/utils.test.ts
import { formatXLM, truncateAddress, getProgressPercent, isExpired } from '@/lib/utils';

describe('Utility Functions', () => {
  test('formatXLM formats amounts correctly', () => {
    expect(formatXLM(10)).toBe("10.00 XLM");
    expect(formatXLM(0)).toBe("0.00 XLM");
  });

  test('truncateAddress truncates Stellar addresses', () => {
    const addr = "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234";
    expect(truncateAddress(addr)).toBe("GABC...1234");
  });

  test('getProgressPercent calculates percentage correctly', () => {
    expect(getProgressPercent(50, 100)).toBe(50);
    expect(getProgressPercent(150, 100)).toBe(100);
    expect(getProgressPercent(0, 100)).toBe(0);
  });

  test('isExpired checks deadline accurately', () => {
    const pastDate = new Date(Date.now() - 100000);
    const futureDate = new Date(Date.now() + 100000);
    expect(isExpired(pastDate)).toBe(true);
    expect(isExpired(futureDate)).toBe(false);
  });
});
