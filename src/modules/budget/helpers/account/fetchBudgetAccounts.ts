import { listAccount } from '@/api/sdk.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  ACCOUNTS_MISSING_ERROR,
  ACCOUNTS_PAGE_LIMIT,
} from '@/modules/budget/constants/queries.ts';
import { fetchAccountPreferences } from '@/modules/budget/helpers/account/fetchAccountPreferences.ts';
import { toBudgetAccounts } from '@/modules/budget/helpers/account/toBudgetAccounts.ts';
import type { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';

export const fetchBudgetAccounts = async (
  date: string,
): Promise<BudgetAccountsByBlock> => {
  const [items, prefs] = await Promise.all([
    collectFireflyPages(
      (page) =>
        listAccount({ query: { page, limit: ACCOUNTS_PAGE_LIMIT, date } }),
      ACCOUNTS_MISSING_ERROR,
    ),
    fetchAccountPreferences(),
  ]);

  return toBudgetAccounts(items, prefs);
};
