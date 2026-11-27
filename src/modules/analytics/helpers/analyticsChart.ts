import { sumToPrimary } from '@/helpers/currency/sumToPrimary.ts';
import {
  AmountInCurrency,
  ExchangeRate,
  WalletCurrency,
} from '@/helpers/currency/types.ts';
import { shiftAnalyticsMonth } from '@/modules/analytics/helpers/analyticsPeriod.ts';
import {
  AnalyticsMonthLabels,
  AnalyticsRange,
} from '@/modules/analytics/types/analytics.ts';
import {
  AnalyticsChartMonthAmounts,
  AnalyticsChartPoint,
} from '@/modules/analytics/types/analyticsChart.ts';
import { startOfMonth } from '@/modules/budget/helpers/month/budgetMonth.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

export const analyticsChartMonths = (range: AnalyticsRange): string[] => {
  const months: string[] = [];
  let month = range.from;

  while (month <= range.to) {
    months.push(month);
    month = shiftAnalyticsMonth(month, 1);
  }

  return months;
};

const pushAmount = (
  amounts: AmountInCurrency[],
  amount: number,
  fromCode: string,
) => {
  const code = fromCode.toUpperCase();

  if (!code || !Number.isFinite(amount)) {
    return;
  }

  amounts.push({ amount: Math.abs(amount), fromCode: code });
};

export const toAnalyticsChartMonths = (
  transactions: AccountTransaction[],
  range: AnalyticsRange,
): AnalyticsChartMonthAmounts[] => {
  const months: AnalyticsChartMonthAmounts[] = analyticsChartMonths(range).map(
    (month) => ({
      month,
      expenses: [],
      incomes: [],
    }),
  );
  const byMonth = new Map(months.map((month) => [month.month, month]));

  transactions.forEach((transaction) => {
    const bucket = byMonth.get(startOfMonth(transaction.date));

    if (!bucket) {
      return;
    }

    if (transaction.type === 'withdrawal') {
      pushAmount(bucket.expenses, transaction.amount, transaction.currencyCode);
      return;
    }

    if (transaction.type === 'deposit') {
      pushAmount(bucket.incomes, transaction.amount, transaction.currencyCode);
    }
  });

  return months;
};

export const toAnalyticsChartPoints = (
  months: AnalyticsChartMonthAmounts[],
  primary: WalletCurrency | undefined,
  rates: ExchangeRate[] | undefined,
): AnalyticsChartPoint[] | null => {
  if (!primary || !rates || months.length === 0) {
    return null;
  }

  const points: AnalyticsChartPoint[] = [];

  for (const month of months) {
    const expenses = sumToPrimary(month.expenses, primary.code, rates);
    const incomes = sumToPrimary(month.incomes, primary.code, rates);

    if (expenses === null || incomes === null) {
      return null;
    }

    points.push({ month: month.month, expenses, incomes });
  }

  return points;
};

const monthNumber = (month: string): number => Number(month.slice(5, 7));

export const analyticsChartMonthLabel = (
  month: string,
  months: readonly string[],
  monthLabels: AnalyticsMonthLabels,
): string => {
  const name = monthLabels[monthNumber(month) - 1];
  const duplicated =
    months.filter((item) => monthNumber(item) === monthNumber(month)).length >
    1;

  return duplicated ? `${name} ${month.slice(0, 4)}` : name;
};
