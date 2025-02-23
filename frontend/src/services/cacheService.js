class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes
    this.maxSize = 100; // Maximum number of items to cache
    
    // Auto cleanup every 5 minutes
    setInterval(() => this.clearExpired(), 5 * 60 * 1000);
  }

  set(key, value, customMaxAge) {
    // Clear old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.clearOldest();
    }

    const expiresAt = Date.now() + (customMaxAge || this.maxAge);
    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clearOldest() {
    let oldest = null;
    let oldestKey = null;

    for (const [key, item] of this.cache.entries()) {
      if (!oldest || item.createdAt < oldest.createdAt) {
        oldest = item;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  clear() {
    this.cache.clear();
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService(); 