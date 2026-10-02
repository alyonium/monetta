import { accountById } from '@/modules/budget/helpers/account/accountById.ts';
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

  const accountsOfType = accounts?.[sessionAccount.type] ?? [];
  const liveAccount = accountById(accountsOfType, sessionAccount.id);

  if (liveAccount) {
    return liveAccount;
  }

  return sessionAccount;
};
