import { describe, expect, it } from 'vitest';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import {
  analyticsChartMonthLabel,
  analyticsChartMonths,
  toAnalyticsChartMonths,
  toAnalyticsChartPoints,
} from '@/modules/analytics/helpers/analyticsChart.ts';
import { AnalyticsMonthLabels } from '@/modules/analytics/types/analytics.ts';
import { createAccountTransaction } from '@/modules/budget/helpers/transactions/tests/testHelpers.ts';

const euro: WalletCurrency = {
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  decimalPlaces: 2,
};

const usdRate = {
  fromCode: 'USD',
  toCode: 'EUR',
  rate: 2,
  date: '2026-01-01',
};

const labels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const satisfies AnalyticsMonthLabels;

describe('analyticsChartMonths', () => {
  it('includes every month from From through To', () => {
    expect(
      analyticsChartMonths({ from: '2026-01-01', to: '2026-03-01' }),
    ).toEqual(['2026-01-01', '2026-02-01', '2026-03-01']);
    expect(
      analyticsChartMonths({ from: '2025-11-01', to: '2026-02-01' }),
    ).toEqual(['2025-11-01', '2025-12-01', '2026-01-01', '2026-02-01']);
  });
});

describe('toAnalyticsChartMonths', () => {
  const range = { from: '2026-01-01', to: '2026-03-01' };

  it('sums deposits and withdrawals by month and leaves an empty month at zero', () => {
    const months = toAnalyticsChartMonths(
      [
        createAccountTransaction({
          date: '2026-01-10',
          type: 'withdrawal',
          amount: 12,
          currencyCode: 'eur',
          foreignAmount: 99,
        }),
        createAccountTransaction({
          date: '2026-01-20',
          type: 'withdrawal',
          amount: 3,
          currencyCode: 'USD',
        }),
        createAccountTransaction({
          date: '2026-03-02',
          type: 'deposit',
          amount: 40,
          currencyCode: 'EUR',
        }),
        createAccountTransaction({
          date: '2026-02-01',
          type: 'transfer',
          amount: 15,
        }),
        createAccountTransaction({
          date: '2026-02-02',
          type: 'reconciliation',
          amount: 8,
        }),
        createAccountTransaction({
          date: '2026-02-03',
          type: 'opening balance',
          amount: 5,
        }),
        createAccountTransaction({
          date: '2025-12-31',
          type: 'deposit',
          amount: 100,
        }),
        createAccountTransaction({
          date: '2026-01-11',
          type: 'withdrawal',
          amount: 4,
          currencyCode: '',
        }),
      ],
      range,
    );

    expect(months).toEqual([
      {
        month: '2026-01-01',
        expenses: [
          { amount: 12, fromCode: 'EUR' },
          { amount: 3, fromCode: 'USD' },
        ],
        incomes: [],
      },
      { month: '2026-02-01', expenses: [], incomes: [] },
      {
        month: '2026-03-01',
        expenses: [],
        incomes: [{ amount: 40, fromCode: 'EUR' }],
      },
    ]);
  });
});

describe('toAnalyticsChartPoints', () => {
  it('converts each month and keeps an empty month at zero', () => {
    expect(
      toAnalyticsChartPoints(
        [
          {
            month: '2026-01-01',
            expenses: [
              { amount: 12, fromCode: 'EUR' },
              { amount: 3, fromCode: 'USD' },
            ],
            incomes: [],
          },
          { month: '2026-02-01', expenses: [], incomes: [] },
        ],
        euro,
        [usdRate],
      ),
    ).toEqual([
      { month: '2026-01-01', expenses: 18, incomes: 0 },
      { month: '2026-02-01', expenses: 0, incomes: 0 },
    ]);
  });

  it('returns null when any amount has no rate', () => {
    expect(
      toAnalyticsChartPoints(
        [
          {
            month: '2026-01-01',
            expenses: [{ amount: 10, fromCode: 'EUR' }],
            incomes: [],
          },
          {
            month: '2026-02-01',
            expenses: [{ amount: 5, fromCode: 'USD' }],
            incomes: [],
          },
        ],
        euro,
        [],
      ),
    ).toBeNull();
  });

  it('returns null without a primary currency', () => {
    expect(
      toAnalyticsChartPoints(
        [{ month: '2026-01-01', expenses: [], incomes: [] }],
        undefined,
        [],
      ),
    ).toBeNull();
  });
});

describe('analyticsChartMonthLabel', () => {
  it('uses the short month name', () => {
    const months = ['2026-01-01', '2026-08-01'];

    expect(analyticsChartMonthLabel('2026-01-01', months, labels)).toBe('Jan');
    expect(analyticsChartMonthLabel('2026-08-01', months, labels)).toBe('Aug');
  });

  it('adds the year when the same month name appears twice', () => {
    const months = ['2025-01-01', '2025-12-01', '2026-01-01'];

    expect(analyticsChartMonthLabel('2025-01-01', months, labels)).toBe(
      'Jan 2025',
    );
    expect(analyticsChartMonthLabel('2026-01-01', months, labels)).toBe(
      'Jan 2026',
    );
    expect(analyticsChartMonthLabel('2025-12-01', months, labels)).toBe('Dec');
  });
});
