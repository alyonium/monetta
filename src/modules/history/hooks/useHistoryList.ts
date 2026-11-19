import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import { filterAccountTransactions } from '@/modules/budget/helpers/transactions/filterAccountTransactions.ts';
import {
  ACCOUNT_TRANSACTION_ORDER,
  type AccountTransactionOrder,
  groupAccountTransactions,
} from '@/modules/budget/helpers/transactions/groupAccountTransactions.ts';
import {
  defaultHistoryFilters,
  historyFilterCount,
} from '@/modules/history/helpers/historyFilters.ts';
import { historyListView } from '@/modules/history/helpers/historyList.ts';
import { useHistoryTransactions } from '@/modules/history/hooks/useHistoryTransactions.ts';

export const useHistoryList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(() =>
    defaultHistoryFilters(todayIso()),
  );
  const [order, setOrder] = useState<AccountTransactionOrder>(
    ACCOUNT_TRANSACTION_ORDER.DESC,
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
    order,
  );

  const toggleOrder = () => {
    setOrder((current) =>
      current === ACCOUNT_TRANSACTION_ORDER.DESC
        ? ACCOUNT_TRANSACTION_ORDER.ASC
        : ACCOUNT_TRANSACTION_ORDER.DESC,
    );

    if (scrollRoot.current) {
      scrollRoot.current.scrollTop = 0;
    }
  };

  const view = historyListView({
    hasPages: data !== undefined,
    isLoading,
    isError,
    matchCount: groups.length,
    hasNextPage: hasNextPage,
    nextPageFailed: isFetchNextPageError,
  });

  const loadNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) {
      return;
    }

    void fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  useEffect(() => {
    loadNextPage();
  }, [loadNextPage, pageCount]);

  return {
    filterCount: historyFilterCount(filters),
    filters,
    groups,
    loadNextPage,
    loadingNextPage: isFetchingNextPage || view.keepPaging,
    nextPageFailed: isFetchNextPageError,
    order,
    scrollRoot,
    search,
    setFilters,
    setSearch,
    pending: view.statusKey === 'history.loading',
    showList: view.showList,
    statusLabel: t(view.statusKey),
    toggleOrder,
  };
};
