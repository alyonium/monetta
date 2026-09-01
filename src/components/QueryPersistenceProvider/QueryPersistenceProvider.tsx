import { useState } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Outlet } from 'react-router';
import { QUERY_CACHE_MAX_AGE_MS } from '@/helpers/query/constants.ts';
import { createQueryClient } from '@/helpers/query/createQueryClient.ts';
import { createQueryPersister } from '@/helpers/query/createQueryPersister.ts';

const QueryPersistenceProvider = () => {
  const [queryClient] = useState(createQueryClient);
  const [persister] = useState(createQueryPersister);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: QUERY_CACHE_MAX_AGE_MS }}
      onSuccess={() => queryClient.invalidateQueries()}
    >
      <Outlet />
    </PersistQueryClientProvider>
  );
};

export default QueryPersistenceProvider;
