import { useQuery } from '@tanstack/react-query';
import { BUDGET_ACCOUNTS_QUERY_KEY } from '@/modules/budget/constants/queries.ts';
import { fetchBudgetAccounts } from '@/modules/budget/helpers/account/fetchBudgetAccounts.ts';
import {
  fireflyBalanceDate,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';

export const useBudgetAccounts = (month: string) => {
  const date = fireflyBalanceDate({ month, today: todayIso() });

  return useQuery({
    queryKey: [...BUDGET_ACCOUNTS_QUERY_KEY, date],
    queryFn: () => fetchBudgetAccounts(date),
  });
};
