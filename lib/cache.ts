// Simple in-memory cache for dashboard stats
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCache = (key: string) => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

export const setCache = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = () => {
  cache.clear();
};
