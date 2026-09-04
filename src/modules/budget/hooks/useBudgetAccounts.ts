import { useQuery } from '@tanstack/react-query';
import { BUDGET_ACCOUNTS_QUERY_KEY } from '@/modules/budget/constants.ts';
import { fetchBudgetAccounts } from '@/modules/budget/helpers/fetchBudgetAccounts.ts';

export const useBudgetAccounts = () =>
  useQuery({
    queryKey: BUDGET_ACCOUNTS_QUERY_KEY,
    queryFn: fetchBudgetAccounts,
  });
