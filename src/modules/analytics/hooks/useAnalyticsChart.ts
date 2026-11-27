import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  EXCHANGE_RATES_QUERY_KEY,
  PRIMARY_CURRENCY_QUERY_KEY,
} from '@/helpers/currency/constants.ts';
import { fetchExchangeRates } from '@/helpers/currency/fetchExchangeRates.ts';
import { fetchPrimaryCurrency } from '@/helpers/currency/fetchPrimaryCurrency.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { ANALYTICS_CHART_QUERY_KEY } from '@/modules/analytics/constants/queries.ts';
import {
  analyticsChartMonthLabel,
  toAnalyticsChartPoints,
} from '@/modules/analytics/helpers/analyticsChart.ts';
import { periodMonthLabels } from '@/modules/analytics/helpers/analyticsPeriod.ts';
import { fetchAnalyticsChart } from '@/modules/analytics/helpers/fetchAnalyticsChart.ts';
import { formatAnalyticsAxisAmount } from '@/modules/analytics/helpers/formatAnalyticsAmount.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import { AnalyticsChartPoint } from '@/modules/analytics/types/analyticsChart.ts';

export const useAnalyticsChart = (
  range: AnalyticsRange,
  tag: string | null,
): {
  currency: WalletCurrency | null;
  isError: boolean;
  label: (month: string) => string;
  points: AnalyticsChartPoint[] | null | undefined;
  yAxisWidth: number;
} => {
  const { t } = useTranslation();
  const { data: primary } = useQuery({
    queryKey: PRIMARY_CURRENCY_QUERY_KEY,
    queryFn: fetchPrimaryCurrency,
  });
  const { data: rates } = useQuery({
    queryKey: EXCHANGE_RATES_QUERY_KEY,
    queryFn: fetchExchangeRates,
  });
  const chart = useQuery({
    queryKey: [...ANALYTICS_CHART_QUERY_KEY, range.from, range.to, tag],
    queryFn: () => fetchAnalyticsChart(range, tag),
  });
  const currency = primary ?? null;
  const points =
    chart.data === undefined || primary === undefined || rates === undefined
      ? undefined
      : toAnalyticsChartPoints(chart.data, primary, rates);
  const months = (points ?? []).map((point) => point.month);
  const monthLabels = periodMonthLabels(t);
  const label = (month: string) =>
    analyticsChartMonthLabel(month, months, monthLabels);
  const peak = (points ?? []).reduce(
    (max, point) => Math.max(max, point.incomes, point.expenses),
    0,
  );
  const yAxisWidth =
    currency === null
      ? 0
      : formatAnalyticsAxisAmount(peak, currency).length * 8 + 12;

  return {
    currency,
    isError: chart.isError,
    label,
    points,
    yAxisWidth,
  };
};
