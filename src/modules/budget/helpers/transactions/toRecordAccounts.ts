import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';

export const toRecordAccounts = (
  accounts: BudgetAccountsByBlock | undefined,
): BudgetAccountsByBlock => ({
  [ACCOUNT_TYPE.INCOME]: accounts?.[ACCOUNT_TYPE.INCOME] ?? [],
  [ACCOUNT_TYPE.CURRENT]: accounts?.[ACCOUNT_TYPE.CURRENT] ?? [],
  [ACCOUNT_TYPE.EXPENSE]: accounts?.[ACCOUNT_TYPE.EXPENSE] ?? [],
});
