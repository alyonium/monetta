import type { QueryClient } from '@tanstack/react-query';
import { TAGS_QUERY_KEY } from '@/helpers/tags/constants.ts';
import {
  ACCOUNT_TRANSACTIONS_QUERY_KEY,
  BUDGET_ACCOUNTS_QUERY_KEY,
  BUDGET_INSIGHTS_QUERY_KEY,
} from '@/modules/budget/constants/queries.ts';
import { HISTORY_TRANSACTIONS_QUERY_KEY } from '@/modules/history/constants/queries.ts';

export const TRANSACTION_QUERY_KEYS = [
  BUDGET_ACCOUNTS_QUERY_KEY,
  BUDGET_INSIGHTS_QUERY_KEY,
  ACCOUNT_TRANSACTIONS_QUERY_KEY,
  TAGS_QUERY_KEY,
  HISTORY_TRANSACTIONS_QUERY_KEY,
] as const;

export const invalidateTransactionQueries = (queryClient: QueryClient) =>
  Promise.all(
    TRANSACTION_QUERY_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    ),
  );
