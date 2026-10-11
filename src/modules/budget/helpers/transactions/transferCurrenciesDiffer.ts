import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const transferCurrenciesDiffer = (
  source: BudgetAccount | undefined,
  destination: BudgetAccount | undefined,
): boolean =>
  Boolean(
    source && destination && source.currencyCode !== destination.currencyCode,
  );
