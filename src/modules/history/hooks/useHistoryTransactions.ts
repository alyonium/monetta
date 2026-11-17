import { useInfiniteQuery } from '@tanstack/react-query';
import { HISTORY_TRANSACTIONS_QUERY_KEY } from '@/modules/history/constants/queries.ts';
import { fetchHistoryTransactionsPage } from '@/modules/history/helpers/fetchHistoryTransactionsPage.ts';

export const useHistoryTransactions = () => {
  const query = useInfiniteQuery({
    queryKey: HISTORY_TRANSACTIONS_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchHistoryTransactionsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, items };
};
