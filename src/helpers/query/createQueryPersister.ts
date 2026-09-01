import { del, get, set } from 'idb-keyval';
import type {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';
import { QUERY_CACHE_KEY } from '@/helpers/query/constants.ts';

export const createQueryPersister = (): Persister => ({
  persistClient: async (client: PersistedClient) => {
    await set(QUERY_CACHE_KEY, client);
  },
  restoreClient: async () => {
    return await get<PersistedClient>(QUERY_CACHE_KEY);
  },
  removeClient: async () => {
    await del(QUERY_CACHE_KEY);
  },
});
