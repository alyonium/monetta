import { QueryClient } from '@tanstack/react-query';
import {
  QUERY_GC_TIME_MS,
  QUERY_RETRY,
  QUERY_STALE_TIME_MS,
} from '@/helpers/query/constants.ts';

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: QUERY_GC_TIME_MS,
        staleTime: QUERY_STALE_TIME_MS,
        retry: QUERY_RETRY,
      },
    },
  });
