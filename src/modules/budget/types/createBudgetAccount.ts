import { CREATE_BUDGET_ACCOUNT_FAILURE_REASON } from '@/modules/budget/constants.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';
import type { CreateAccountFormValues } from '@/modules/budget/types/createAccountForm.ts';

export type CreateBudgetAccountFailureReason =
  (typeof CREATE_BUDGET_ACCOUNT_FAILURE_REASON)[keyof typeof CREATE_BUDGET_ACCOUNT_FAILURE_REASON];

export type CreateBudgetAccountResult =
  | { ok: true }
  | { ok: false; reason: CreateBudgetAccountFailureReason };

export type CreateBudgetAccountInput = {
  accountType: AccountType;
  values: CreateAccountFormValues;
  openingBalanceDate: string;
  orderedIds: string[];
};
