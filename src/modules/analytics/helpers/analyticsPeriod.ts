import dayjs from 'dayjs';
import { startOfMonth } from '@/modules/budget/helpers/month/budgetMonth.ts';
import {
  ANALYTICS_MIN_YEAR,
  ANALYTICS_MONTH_LABEL_KEYS,
  ANALYTICS_RANGE_BOUND,
  DIAGRAM_MONTH_SWIPE,
} from '@/modules/analytics/constants/analytics.ts';
import {
  AnalyticsMonthLabels,
  AnalyticsRange,
  AnalyticsRangeBound,
  DiagramMonthSwipe,
} from '@/modules/analytics/types/analytics.ts';

const ISO_DATE = 'YYYY-MM-DD';
const ANALYTICS_MIN_MONTH = `${ANALYTICS_MIN_YEAR}-01-01`;

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

export const shiftAnalyticsMonth = (
  monthStart: string,
  delta: number,
): string =>
  dayjs(monthStart).add(delta, 'month').startOf('month').format(ISO_DATE);

export const stepDiagramMonth = (
  range: AnalyticsRange,
  direction: DiagramMonthSwipe,
  today: string,
): AnalyticsRange | null => {
  if (range.from !== range.to) {
    return null;
  }

  const delta = direction === DIAGRAM_MONTH_SWIPE.PREVIOUS ? -1 : 1;
  const month = shiftAnalyticsMonth(range.from, delta);

  if (month < ANALYTICS_MIN_MONTH || month > startOfMonth(today)) {
    return null;
  }

  return { from: month, to: month };
};

export const diagramMonthDots = (
  range: AnalyticsRange,
  today: string,
): AnalyticsRange[] | null => {
  if (range.from !== range.to) {
    return null;
  }

  const previous = stepDiagramMonth(
    range,
    DIAGRAM_MONTH_SWIPE.PREVIOUS,
    today,
  );
  const next = stepDiagramMonth(range, DIAGRAM_MONTH_SWIPE.NEXT, today);
  const dots = [range];

  if (previous) {
    dots.unshift(previous);
  }

  if (next) {
    dots.push(next);
  }

  return dots;
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
