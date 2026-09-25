import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export type RecordIncomeFormValues = {
  incomeAccountId: string;
  currentAccountId: string;
  amount: number | string;
  date: string;
  description: string;
  tags: string[];
};

export type RecordIncomeFormFieldErrors = {
  incomeAccountId?: 'budget.recordTransaction.errors.accountRequired';
  currentAccountId?: 'budget.recordTransaction.errors.accountRequired';
  amount?: 'budget.recordTransaction.errors.amountRequired';
  date?: 'budget.recordTransaction.errors.dateRequired';
};

export type UseRecordIncomeFormParams = {
  onClose: () => void;
  source: BudgetAccount;
  destination: BudgetAccount;
  incomeAccounts: BudgetAccount[];
  currentAccounts: BudgetAccount[];
  month: string;
};
