import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const accountById = (accounts: BudgetAccount[], id: string) =>
  accounts.find((account) => account.id === id);
