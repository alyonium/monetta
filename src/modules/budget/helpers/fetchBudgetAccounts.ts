import { listAccount } from '@/api/sdk.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  ACCOUNTS_MISSING_ERROR,
  ACCOUNTS_PAGE_LIMIT,
} from '@/modules/budget/constants.ts';
import { fetchAccountPreferences } from '@/modules/budget/helpers/fetchAccountPreferences.ts';
import { toBudgetAccounts } from '@/modules/budget/helpers/toBudgetAccounts.ts';
import type { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';

export const fetchBudgetAccounts = async (): Promise<BudgetAccountsByBlock> => {
  const [items, prefs] = await Promise.all([
    collectFireflyPages(
      (page) => listAccount({ query: { page, limit: ACCOUNTS_PAGE_LIMIT } }),
      ACCOUNTS_MISSING_ERROR,
    ),
    fetchAccountPreferences(),
  ]);

  return toBudgetAccounts(items, prefs);
};
