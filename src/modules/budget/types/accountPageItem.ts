import { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export type AccountPageItem =
  | { type: 'add' }
  | { type: 'account'; account: BudgetAccount };
