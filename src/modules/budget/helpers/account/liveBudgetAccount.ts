import type {
  BudgetAccount,
  BudgetAccountsByBlock,
} from '@/modules/budget/types/budgetAccount.ts';

export const liveBudgetAccount = (
  accounts: BudgetAccountsByBlock | undefined,
  sessionAccount: BudgetAccount | null,
): BudgetAccount | null => {
  if (!sessionAccount) {
    return null;
  }

  return (
    accounts?.[sessionAccount.type].find(
      (item) => item.id === sessionAccount.id,
    ) ?? sessionAccount
  );
};
