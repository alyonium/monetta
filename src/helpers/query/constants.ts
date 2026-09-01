// Query cache is per-device (IndexedDB), source of truth is Firefly
export const QUERY_GC_TIME_MS = 1000 * 60 * 60 * 24 * 90;
export const QUERY_STALE_TIME_MS = 1000 * 60 * 60;
export const QUERY_RETRY = 1;
export const QUERY_CACHE_KEY = 'monetta.queryCache';
export const QUERY_CACHE_MAX_AGE_MS = QUERY_GC_TIME_MS;
