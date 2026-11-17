import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filterAccountTransactions } from '@/modules/budget/helpers/transactions/filterAccountTransactions.ts';
import { groupAccountTransactions } from '@/modules/budget/helpers/transactions/groupAccountTransactions.ts';
import {
  historyListView,
  isHistoryListAtBottom,
} from '@/modules/history/helpers/historyList.ts';
import { useHistoryTransactions } from '@/modules/history/hooks/useHistoryTransactions.ts';

export const useHistoryList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
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
  } = useHistoryTransactions();

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
    groups,
    loadNextPage,
    loadingNextPage: isFetchingNextPage || view.keepPaging,
    nextPageFailed: isFetchNextPageError,
    scrollRoot,
    search,
    setSearch,
    showList: view.showList,
    statusLabel: t(view.statusKey),
  };
};
