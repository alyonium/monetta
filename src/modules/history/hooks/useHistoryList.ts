import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import { filterAccountTransactions } from '@/modules/budget/helpers/transactions/filterAccountTransactions.ts';
import { groupAccountTransactions } from '@/modules/budget/helpers/transactions/groupAccountTransactions.ts';
import {
  defaultHistoryFilters,
  historyFilterCount,
} from '@/modules/history/helpers/historyFilters.ts';
import {
  historyListView,
  isHistoryListAtBottom,
} from '@/modules/history/helpers/historyList.ts';
import { useHistoryTransactions } from '@/modules/history/hooks/useHistoryTransactions.ts';

export const useHistoryList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(() =>
    defaultHistoryFilters(todayIso()),
  );
  const scrollRoot = useRef<HTMLDivElement>(null);

  const {
    data,
    items,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
  } = useHistoryTransactions(filters);

  const pageCount = data?.pages.length ?? 0;

  const groups = groupAccountTransactions(
    filterAccountTransactions(items, search),
  );

  const view = historyListView({
    hasPages: data !== undefined,
    isLoading,
    isError,
    matchCount: groups.length,
    hasNextPage: hasNextPage,
    nextPageFailed: isFetchNextPageError,
  });

  const loadNextPage = useCallback(() => {
    const root = scrollRoot.current;

    if (
      !root ||
      !isHistoryListAtBottom(root) ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    void fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  useEffect(() => {
    loadNextPage();
  }, [loadNextPage, pageCount, search, groups.length]);

  return {
    filterCount: historyFilterCount(filters),
    filters,
    groups,
    loadNextPage,
    loadingNextPage: isFetchingNextPage || view.keepPaging,
    nextPageFailed: isFetchNextPageError,
    scrollRoot,
    search,
    setFilters,
    setSearch,
    showList: view.showList,
    statusLabel: t(view.statusKey),
  };
};
