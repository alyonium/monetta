import { useQuery } from '@tanstack/react-query';
import { ACCOUNT_TRANSACTIONS_QUERY_KEY } from '@/modules/budget/constants/queries.ts';
import { fetchAccountTransactions } from '@/modules/budget/helpers/transactions/fetchAccountTransactions.ts';

export const useAccountTransactions = (accountId: string, enabled: boolean) =>
  useQuery({
    queryKey: [...ACCOUNT_TRANSACTIONS_QUERY_KEY, accountId],
    queryFn: () => fetchAccountTransactions(accountId),
    enabled,
  });
