// src/lib/cache.ts

interface CacheEntry {
  value: any;
  expiry: number;
}

class Cache {
  private cache: Map<string, CacheEntry>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, value: any, ttlSeconds: number): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  bust(key: string): void {
    this.cache.delete(key);
  }
}

const cache = new Cache();
export default cache;
