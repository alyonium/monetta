import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const toAccountSelectData = (accounts: BudgetAccount[]) =>
  accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
