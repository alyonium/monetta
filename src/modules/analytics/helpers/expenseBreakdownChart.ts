import { DEFAULT_THEME } from '@mantine/core';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { AnalyticsRankSide } from '@/modules/analytics/types/analyticsBreakdown.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { DEFAULT_ACCOUNT_COLOR } from '@/modules/budget/constants/appearance.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';

export const DONUT_MAX_SIZE = 180;
export const DONUT_MIN_SIZE = 128;
export const DONUT_THICKNESS = 22;
export const DONUT_PADDING_ANGLE = 3;
export const DONUT_CORNER_RADIUS = 4;

const CHART_HUES = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'grape',
  'pink',
] as const;

const CHART_SHADES = [6, 4, 8] as const;

const CHART_COLORS = CHART_SHADES.flatMap((shade) =>
  CHART_HUES.map((hue) => DEFAULT_THEME.colors[hue][shade]),
);

const normalize = (color: string): string => color.trim().toLowerCase();

export const donutSizeForWidth = (width: number): number => {
  if (width <= 0) {
    return DONUT_MIN_SIZE;
  }

  return Math.min(
    DONUT_MAX_SIZE,
    Math.max(DONUT_MIN_SIZE, Math.floor(width * 0.46)),
  );
};

export const segmentColorById = (
  accounts: BudgetAccountsByBlock | undefined,
  items: readonly { id: string }[],
): Map<string, string> => {
  const own = new Map<string, string | null>();

  if (accounts) {
    [
      ...accounts[ACCOUNT_TYPE.INCOME],
      ...accounts[ACCOUNT_TYPE.CURRENT],
      ...accounts[ACCOUNT_TYPE.EXPENSE],
    ].forEach((account) => {
      own.set(account.id, account.color);
    });
  }

  const used = new Set<string>();
  const colors = new Map<string, string>();

  items.forEach((item) => {
    const preferred = own.get(item.id) ?? DEFAULT_ACCOUNT_COLOR;
    const free =
      CHART_COLORS.find((color) => !used.has(normalize(color))) ??
      CHART_COLORS[0];
    const color = used.has(normalize(preferred)) ? free : preferred;

    used.add(normalize(color));
    colors.set(item.id, color);
  });

  return colors;
};

export const toExpenseBreakdownChart = (
  accounts: BudgetAccountsByBlock | undefined,
  currency: WalletCurrency | null,
  side: AnalyticsRankSide,
) => {
  const colors = segmentColorById(accounts, side.items);
  const segments = side.items.map((item) => ({
    name: item.name,
    value: item.amount,
    color: colors.get(item.id) as string,
  }));
  const chart = currency && segments.length > 0 ? { currency, segments } : null;

  return { chart, segments };
};
