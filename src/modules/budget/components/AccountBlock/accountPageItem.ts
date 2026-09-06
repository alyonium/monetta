import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

const ADD_ITEM: AccountPageItem = { type: 'add' };

export const toAccountPageItems = (
  accounts: BudgetAccount[],
): AccountPageItem[] => [
  ...accounts.map(
    (account): AccountPageItem => ({ type: 'account', account }),
  ),
  ADD_ITEM,
];
