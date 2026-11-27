import { useQuery } from '@tanstack/react-query';
import {
  EXCHANGE_RATES_QUERY_KEY,
  PRIMARY_CURRENCY_QUERY_KEY,
} from '@/helpers/currency/constants.ts';
import { fetchExchangeRates } from '@/helpers/currency/fetchExchangeRates.ts';
import { fetchPrimaryCurrency } from '@/helpers/currency/fetchPrimaryCurrency.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { ANALYTICS_BREAKDOWN_QUERY_KEY } from '@/modules/analytics/constants/queries.ts';
import {
  analyticsBreakdownPeriod,
  rankAnalyticsBreakdown,
} from '@/modules/analytics/helpers/analyticsBreakdown.ts';
import { fetchAnalyticsBreakdown } from '@/modules/analytics/helpers/fetchAnalyticsBreakdown.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import { AnalyticsBreakdownRank } from '@/modules/analytics/types/analyticsBreakdown.ts';

export const useAnalyticsBreakdown = (
  range: AnalyticsRange,
  tag: string | null,
): {
  currency: WalletCurrency | null;
  isError: boolean;
  ranked: AnalyticsBreakdownRank | null;
} => {
  const { start, end } = analyticsBreakdownPeriod(range);
  const { data: primary } = useQuery({
    queryKey: PRIMARY_CURRENCY_QUERY_KEY,
    queryFn: fetchPrimaryCurrency,
  });
  const { data: rates } = useQuery({
    queryKey: EXCHANGE_RATES_QUERY_KEY,
    queryFn: fetchExchangeRates,
  });
  const breakdown = useQuery({
    queryKey: [...ANALYTICS_BREAKDOWN_QUERY_KEY, start, end, tag],
    queryFn: () => fetchAnalyticsBreakdown(start, end, tag),
  });
  const ranked =
    breakdown.data === undefined
      ? null
      : rankAnalyticsBreakdown(breakdown.data, primary, rates);

  return {
    currency: primary ?? null,
    isError: breakdown.isError,
    ranked,
  };
};
