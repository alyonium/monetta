import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  historyStatusKey,
  isHistoryListAtBottom,
} from '@/modules/history/helpers/historyList.ts';
import { useHistoryTransactions } from '@/modules/history/hooks/useHistoryTransactions.ts';

export const useHistoryList = () => {
  const { t } = useTranslation();
  const scrollRoot = useRef<HTMLDivElement>(null);
  const nextPageRequested = useRef(false);
  const {
    data,
    groups,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
  } = useHistoryTransactions();
  const pageCount = data?.pages.length ?? 0;

  const loadNextPage = useCallback(() => {
    const root = scrollRoot.current;

    if (
      nextPageRequested.current ||
      !root ||
      !isHistoryListAtBottom(root) ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    nextPageRequested.current = true;
    void fetchNextPage().finally(() => {
      nextPageRequested.current = false;
    });
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  useEffect(() => {
    loadNextPage();
  }, [loadNextPage, pageCount]);

  const hasPages = data !== undefined;

  return {
    groups,
    loadNextPage,
    loadingNextPage: isFetchingNextPage,
    nextPageFailed: isFetchNextPageError,
    scrollRoot,
    showList: hasPages && groups.length > 0,
    statusLabel: t(historyStatusKey(hasPages, isLoading, isError)),
  };
};
