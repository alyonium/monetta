import { listTransaction } from '@/api/sdk.gen.ts';
import { toAccountTransactions } from '@/modules/budget/helpers/transactions/toAccountTransactions.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import {
  HISTORY_TRANSACTIONS_MISSING_ERROR,
  HISTORY_TRANSACTIONS_PAGE_LIMIT,
} from '@/modules/history/constants/queries.ts';

export type HistoryTransactionsPage = {
  items: AccountTransaction[];
  page: number;
  totalPages: number;
};

export const fetchHistoryTransactionsPage = async (
  page: number,
): Promise<HistoryTransactionsPage> => {
  const result = await listTransaction({
    query: { page, limit: HISTORY_TRANSACTIONS_PAGE_LIMIT },
  }).catch((error: unknown) => {
    throw error instanceof Error
      ? error
      : new Error(HISTORY_TRANSACTIONS_MISSING_ERROR);
  });

  const payload = result.data;
  const pageItems = payload?.data;

  if (!payload || !pageItems) {
    throw new Error(HISTORY_TRANSACTIONS_MISSING_ERROR);
  }

  return {
    items: toAccountTransactions(pageItems),
    page,
    totalPages: payload.meta?.pagination?.total_pages ?? page,
  };
};
