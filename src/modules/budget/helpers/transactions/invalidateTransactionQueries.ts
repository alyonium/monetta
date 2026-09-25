import type { QueryClient } from '@tanstack/react-query';
import { TAGS_QUERY_KEY } from '@/helpers/tags/constants.ts';
import {
  ACCOUNT_TRANSACTIONS_QUERY_KEY,
  BUDGET_ACCOUNTS_QUERY_KEY,
  BUDGET_INSIGHTS_QUERY_KEY,
} from '@/modules/budget/constants/queries.ts';
import { HISTORY_TRANSACTIONS_QUERY_KEY } from '@/modules/history/constants/queries.ts';

export const invalidateTransactionQueries = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: BUDGET_ACCOUNTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: BUDGET_INSIGHTS_QUERY_KEY }),
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_TRANSACTIONS_QUERY_KEY,
    }),
    queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY }),
    queryClient.invalidateQueries({
      queryKey: HISTORY_TRANSACTIONS_QUERY_KEY,
    }),
  ]);
