import { listTransaction, listTransactionByTag } from '@/api/sdk.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  ANALYTICS_CHART_MISSING_ERROR,
  ANALYTICS_CHART_PAGE_LIMIT,
} from '@/modules/analytics/constants/queries.ts';
import { analyticsBreakdownPeriod } from '@/modules/analytics/helpers/analyticsBreakdown.ts';
import { toAnalyticsChartMonths } from '@/modules/analytics/helpers/analyticsChart.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import { AnalyticsChartMonthAmounts } from '@/modules/analytics/types/analyticsChart.ts';
import { toAccountTransactions } from '@/modules/budget/helpers/transactions/toAccountTransactions.ts';

const fetchChartTransactions = (
  start: string,
  end: string,
  tag: string | null,
) =>
  collectFireflyPages((page) => {
    const query = {
      page,
      limit: ANALYTICS_CHART_PAGE_LIMIT,
      start,
      end,
    };

    return tag === null
      ? listTransaction({ query })
      : listTransactionByTag({ path: { tag }, query });
  }, ANALYTICS_CHART_MISSING_ERROR);

export const fetchAnalyticsChart = async (
  range: AnalyticsRange,
  tag: string | null,
): Promise<AnalyticsChartMonthAmounts[]> => {
  const { start, end } = analyticsBreakdownPeriod(range);
  const groups = await fetchChartTransactions(start, end, tag);

  return toAnalyticsChartMonths(toAccountTransactions(groups), range);
};
