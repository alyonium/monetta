export const ANALYTICS_VIEW = {
  DIAGRAM: 'diagram',
  CHART: 'chart',
} as const;

export const ANALYTICS_CATEGORY = {
  EXPENSES: 'expenses',
  INCOMES: 'incomes',
} as const;

export const ANALYTICS_RANGE_BOUND = {
  FROM: 'from',
  TO: 'to',
} as const;

export const DIAGRAM_MONTH_SWIPE = {
  PREVIOUS: 'previous',
  NEXT: 'next',
} as const;

export const ANALYTICS_MIN_YEAR = 2000;

export const ANALYTICS_MONTHS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
] as const;

export const yearSelectData = (today: string): string[] => {
  const todayYear = Number(today.slice(0, 4));

  return Array.from(
    { length: todayYear - ANALYTICS_MIN_YEAR + 1 },
    (_, index) => String(ANALYTICS_MIN_YEAR + index),
  );
};

export const ANALYTICS_VIEW_DATA = [
  { value: ANALYTICS_VIEW.DIAGRAM, label: 'analytics.diagram' },
  { value: ANALYTICS_VIEW.CHART, label: 'analytics.chart' },
] as const;

export const ANALYTICS_CATEGORY_DATA = [
  { value: ANALYTICS_CATEGORY.EXPENSES, label: 'analytics.expenses' },
  { value: ANALYTICS_CATEGORY.INCOMES, label: 'analytics.incomes' },
] as const;

export const ANALYTICS_MONTH_LABEL_KEYS = [
  'analytics.months.m1',
  'analytics.months.m2',
  'analytics.months.m3',
  'analytics.months.m4',
  'analytics.months.m5',
  'analytics.months.m6',
  'analytics.months.m7',
  'analytics.months.m8',
  'analytics.months.m9',
  'analytics.months.m10',
  'analytics.months.m11',
  'analytics.months.m12',
] as const;
