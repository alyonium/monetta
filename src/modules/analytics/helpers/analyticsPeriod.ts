import { startOfMonth } from '@/modules/budget/helpers/month/budgetMonth.ts';
import {
  ANALYTICS_MONTH_LABEL_KEYS,
  ANALYTICS_RANGE_BOUND,
} from '@/modules/analytics/constants/analytics.ts';
import {
  AnalyticsMonthLabels,
  AnalyticsRange,
  AnalyticsRangeBound,
} from '@/modules/analytics/types/analytics.ts';

export const defaultDiagramRange = (today: string): AnalyticsRange => {
  const month = startOfMonth(today);

  return { from: month, to: month };
};

export const defaultChartRange = (today: string): AnalyticsRange => {
  const month = startOfMonth(today);

  return { from: `${month.slice(0, 4)}-01-01`, to: month };
};

export const clampAnalyticsRange = (
  range: AnalyticsRange,
  bound: AnalyticsRangeBound,
  value: string,
  today: string,
): AnalyticsRange => {
  const month = startOfMonth(value);
  const todayMonth = startOfMonth(today);
  const next = month > todayMonth ? todayMonth : month;
  const updated: AnalyticsRange =
    bound === ANALYTICS_RANGE_BOUND.FROM
      ? { from: next, to: range.to }
      : { from: range.from, to: next };

  if (updated.from > updated.to) {
    return { from: next, to: next };
  }

  return updated;
};

export const periodMonthLabels = (
  translate: (key: (typeof ANALYTICS_MONTH_LABEL_KEYS)[number]) => string,
): AnalyticsMonthLabels => [
  translate(ANALYTICS_MONTH_LABEL_KEYS[0]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[1]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[2]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[3]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[4]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[5]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[6]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[7]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[8]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[9]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[10]),
  translate(ANALYTICS_MONTH_LABEL_KEYS[11]),
];

const monthLabel = (
  isoDate: string,
  monthLabels: AnalyticsMonthLabels,
): string => monthLabels[Number(isoDate.slice(5, 7)) - 1];

export const formatAnalyticsPeriod = (
  range: AnalyticsRange,
  monthLabels: AnalyticsMonthLabels,
): string => {
  const fromLabel = monthLabel(range.from, monthLabels);
  const toLabel = monthLabel(range.to, monthLabels);
  const fromYear = range.from.slice(0, 4);
  const toYear = range.to.slice(0, 4);

  if (range.from === range.to) {
    return `${fromLabel} ${fromYear}`;
  }

  if (fromYear === toYear) {
    return `${fromLabel} - ${toLabel} ${fromYear}`;
  }

  return `${fromLabel} ${fromYear} - ${toLabel} ${toYear}`;
};
