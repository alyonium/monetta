import {
  insightExpenseExpense,
  insightIncomeRevenue,
  listTransactionByTag,
} from '@/api/sdk.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  ANALYTICS_BREAKDOWN_MISSING_ERROR,
  ANALYTICS_BREAKDOWN_PAGE_LIMIT,
} from '@/modules/analytics/constants/queries.ts';
import {
  toInsightAccounts,
  toTaggedBreakdown,
} from '@/modules/analytics/helpers/analyticsBreakdown.ts';
import { AnalyticsBreakdownAmounts } from '@/modules/analytics/types/analyticsBreakdown.ts';
import { toAccountTransactions } from '@/modules/budget/helpers/transactions/toAccountTransactions.ts';

const fetchInsightBreakdown = async (
  start: string,
  end: string,
): Promise<AnalyticsBreakdownAmounts> => {
  const [expenseResult, incomeResult] = await Promise.all([
    insightExpenseExpense({ query: { start, end } }),
    insightIncomeRevenue({ query: { start, end } }),
  ]).catch((error: unknown) => {
    throw error instanceof Error
      ? error
      : new Error(ANALYTICS_BREAKDOWN_MISSING_ERROR);
  });

  const expenses = expenseResult.data;
  const incomes = incomeResult.data;

  if (!expenses || !incomes) {
    throw new Error(ANALYTICS_BREAKDOWN_MISSING_ERROR);
  }

  return {
    expenses: toInsightAccounts(expenses),
    incomes: toInsightAccounts(incomes),
  };
};

const fetchTaggedBreakdown = async (
  start: string,
  end: string,
  tag: string,
): Promise<AnalyticsBreakdownAmounts> => {
  const groups = await collectFireflyPages(
    (page) =>
      listTransactionByTag({
        path: { tag },
        query: {
          page,
          limit: ANALYTICS_BREAKDOWN_PAGE_LIMIT,
          start,
          end,
        },
      }),
    ANALYTICS_BREAKDOWN_MISSING_ERROR,
  );

  return toTaggedBreakdown(toAccountTransactions(groups));
};

export const fetchAnalyticsBreakdown = (
  start: string,
  end: string,
  tag: string | null,
): Promise<AnalyticsBreakdownAmounts> =>
  tag === null
    ? fetchInsightBreakdown(start, end)
    : fetchTaggedBreakdown(start, end, tag);
