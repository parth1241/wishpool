// tests/cache.test.ts
import cache from '@/lib/cache';

describe('Cache Singleton', () => {
  beforeEach(() => {
    cache.bust('test-key');
  });

  test('set and get returns the stored value', () => {
    cache.set('test-key', { foo: 'bar' }, 60);
    expect(cache.get('test-key')).toEqual({ foo: 'bar' });
  });

  test('get returns null for missing key', () => {
    expect(cache.get('non-existent')).toBeNull();
  });

  test('bust removes the key from cache', () => {
    cache.set('test-key', 'data', 60);
    cache.bust('test-key');
    expect(cache.get('test-key')).toBeNull();
  });

  test('expired entry returns null', async () => {
    cache.set('test-key', 'expired-soon', 0);
    // Give it a tiny bit of time to ensure the timestamp comparison is correct
    await new Promise(r => setTimeout(r, 1));
    expect(cache.get('test-key')).toBeNull();
  });
});
