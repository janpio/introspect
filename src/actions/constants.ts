export const ROOT_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://introspect.dev';

export const DEFAULT_CACHE_TIME = 1000 * 60 * 60 * 24;
export const DEFAULT_STALE_TIME = 1000 * 60 * 60 * 24;

export const DEFAULT_RQ_OPTIONS = {
  cacheTime: DEFAULT_CACHE_TIME,
  staleTime: DEFAULT_STALE_TIME,
  suspense: true,
};
