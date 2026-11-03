import type { QueryClient } from '@tanstack/react-query';
import { BUDGET_ACCOUNTS_QUERY_KEY } from '@/modules/budget/constants/queries.ts';
import { sortAccountsByOrder } from '@/modules/budget/helpers/account/sortAccountsByOrder.ts';
import { writeAccountOrder } from '@/modules/budget/helpers/account/writeAccountPreferences.ts';
import {
  fireflyBalanceDate,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import type {
  AccountType,
  BudgetAccount,
  BudgetAccountsByBlock,
} from '@/modules/budget/types/budgetAccount.ts';

const refreshAccounts = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: BUDGET_ACCOUNTS_QUERY_KEY });

export const persistBlockOrder = async (
  queryClient: QueryClient,
  month: string,
  type: AccountType,
  ordered: BudgetAccount[],
): Promise<void> => {
  const ids = ordered.map((account) => account.id);
  const date = fireflyBalanceDate({ month, today: todayIso() });

  queryClient.setQueryData<BudgetAccountsByBlock>(
    [...BUDGET_ACCOUNTS_QUERY_KEY, date],
    (current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [type]: sortAccountsByOrder(current[type], ids),
      };
    },
  );

  await writeAccountOrder(type, ids).catch(() => undefined);
  await refreshAccounts(queryClient);
};
