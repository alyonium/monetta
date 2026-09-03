import type { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

export type AccountAppearance = {
  icon: string;
  color: string;
};

export type BudgetAccount = {
  id: string;
  name: string;
  type: AccountType;
  isDebt: boolean;
  icon: string | null;
  color: string | null;
  balance: number;
  currencyCode: string;
  currencySymbol: string;
  debtAmount: number | null;
  paidAmount: number | null;
};

export type AccountPreferences = {
  appearanceById: Record<string, AccountAppearance>;
  orderByBlock: Record<AccountType, string[]>;
};

export type BudgetAccountsByBlock = Record<AccountType, BudgetAccount[]>;
