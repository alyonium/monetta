import type { AmountInCurrency, WalletCurrency } from '@/helpers/currency/types.ts';

export type BudgetInsights = {
  income: AmountInCurrency[];
  expenses: AmountInCurrency[];
};

export type BudgetMonthTotals = {
  income: number | null;
  expenses: number | null;
  balance: number | null;
  currency: WalletCurrency | null;
};

