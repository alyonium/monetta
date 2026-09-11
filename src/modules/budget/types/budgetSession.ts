import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';

export type CreateAccountSession = {
  opened: boolean;
  type: AccountType;
  id: number;
};

export type AccountDetailsSession =
  | { opened: false; account: BudgetAccount | null }
  | { opened: true; account: BudgetAccount };

export type EditAccountSession =
  | { opened: false; account: BudgetAccount | null; id: number }
  | { opened: true; account: BudgetAccount; id: number };
