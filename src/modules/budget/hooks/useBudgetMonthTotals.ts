import { useQuery } from '@tanstack/react-query';
import {
  EXCHANGE_RATES_QUERY_KEY,
  PRIMARY_CURRENCY_QUERY_KEY,
} from '@/helpers/currency/constants.ts';
import { fetchExchangeRates } from '@/helpers/currency/fetchExchangeRates.ts';
import { fetchPrimaryCurrency } from '@/helpers/currency/fetchPrimaryCurrency.ts';
import { BUDGET_INSIGHTS_QUERY_KEY } from '@/modules/budget/constants.ts';
import { monthRange, todayIso } from '@/modules/budget/helpers/budgetMonth.ts';
import { fetchBudgetInsights } from '@/modules/budget/helpers/fetchBudgetInsights.ts';
import { toBudgetMonthTotals } from '@/modules/budget/helpers/toBudgetMonthTotals.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type { BudgetMonthTotals } from '@/modules/budget/types/budgetMonthTotals.ts';

export const useBudgetMonthTotals = (
  month: string,
  currentAccounts: BudgetAccount[] | undefined,
): BudgetMonthTotals => {
  const { start, end } = monthRange({ month, today: todayIso() });

  const { data: primary } = useQuery({
    queryKey: PRIMARY_CURRENCY_QUERY_KEY,
    queryFn: fetchPrimaryCurrency,
  });

  const { data: rates } = useQuery({
    queryKey: EXCHANGE_RATES_QUERY_KEY,
    queryFn: fetchExchangeRates,
  });

  const { data: insights } = useQuery({
    queryKey: [...BUDGET_INSIGHTS_QUERY_KEY, start, end],
    queryFn: () => fetchBudgetInsights(start, end),
  });

  return toBudgetMonthTotals({
    insights,
    currentAccounts,
    primary,
    rates,
  });
};
