import { arrayMove } from '@dnd-kit/sortable';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const reorderBlock = (
  accounts: BudgetAccount[],
  active: BudgetAccount,
  over: BudgetAccount,
): BudgetAccount[] | null => {
  if (active.type !== over.type || active.id === over.id) {
    return null;
  }

  const from = accounts.findIndex((account) => account.id === active.id);
  const to = accounts.findIndex((account) => account.id === over.id);

  if (from < 0 || to < 0) {
    return null;
  }

  return arrayMove(accounts, from, to);
};
