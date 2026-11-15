import { insightExpenseTotal, insightIncomeTotal } from '@/api/sdk.gen.ts';
import { InsightTotalEntry } from '@/api/types.gen.ts';
import { AmountInCurrency } from '@/helpers/currency/types.ts';
import { BUDGET_INSIGHTS_MISSING_ERROR } from '@/modules/budget/constants/queries.ts';
import { BudgetInsights } from '@/modules/budget/types/budgetMonthTotals.ts';

const toInsightAmounts = (entries: InsightTotalEntry[]): AmountInCurrency[] =>
  entries.reduce<AmountInCurrency[]>((amounts, entry) => {
    const fromCode = entry.currency_code;
    const amount = Number(entry.difference);

    if (fromCode && Number.isFinite(amount)) {
      amounts.push({ amount: Math.abs(amount), fromCode });
    }

    return amounts;
  }, []);

export const fetchBudgetInsights = async (
  start: string,
  end: string,
): Promise<BudgetInsights> => {
  const [incomeResult, expenseResult] = await Promise.all([
    insightIncomeTotal({ query: { start, end } }),
    insightExpenseTotal({ query: { start, end } }),
  ]).catch((error: unknown) => {
    throw error instanceof Error
      ? error
      : new Error(BUDGET_INSIGHTS_MISSING_ERROR);
  });

  const income = incomeResult.data;
  const expenses = expenseResult.data;

  if (!income || !expenses) {
    throw new Error(BUDGET_INSIGHTS_MISSING_ERROR);
  }

  return {
    income: toInsightAmounts(income),
    expenses: toInsightAmounts(expenses),
  };
};
