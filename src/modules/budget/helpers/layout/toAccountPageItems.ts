import { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

const ADD_ITEM: AccountPageItem = { type: 'add' };

export const toAccountPageItems = (
  accounts: BudgetAccount[],
  editing = false,
): AccountPageItem[] => {
  const items = accounts.map((account): AccountPageItem => ({
    type: 'account',
    account,
  }));

  if (editing) {
    return items;
  }

  return [...items, ADD_ITEM];
};
