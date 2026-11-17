import { useInfiniteQuery } from '@tanstack/react-query';
import { HISTORY_TRANSACTIONS_QUERY_KEY } from '@/modules/history/constants/queries.ts';
import { fetchHistoryTransactionsPage } from '@/modules/history/helpers/fetchHistoryTransactionsPage.ts';
import { toHistoryTransactionsQuery } from '@/modules/history/helpers/historyFilters.ts';
import { HistoryFilters } from '@/modules/history/types/historyFilters.ts';

export const useHistoryTransactions = (filters: HistoryFilters) => {
  const transactionsQuery = toHistoryTransactionsQuery(filters);

  const query = useInfiniteQuery({
    queryKey: [...HISTORY_TRANSACTIONS_QUERY_KEY, transactionsQuery],
    queryFn: ({ pageParam }) =>
      fetchHistoryTransactionsPage(pageParam, transactionsQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, items };
};
