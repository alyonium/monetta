import { describe, expect, it } from 'vitest';
import { InsightGroupEntry } from '@/api/types.gen.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import {
  analyticsBreakdownPeriod,
  rankAnalyticsBreakdown,
  toInsightAccounts,
} from '@/modules/analytics/helpers/analyticsBreakdown.ts';
import { AnalyticsAccountAmounts } from '@/modules/analytics/types/analyticsBreakdown.ts';

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

const account = (
  id: string,
  name: string,
  amount: number,
  fromCode = 'EUR',
): AnalyticsAccountAmounts => ({
  id,
  name,
  amounts: [{ amount, fromCode }],
});

describe('analyticsBreakdownPeriod', () => {
  it('ends on the last day of the To month', () => {
    expect(
      analyticsBreakdownPeriod({ from: '2026-01-01', to: '2026-08-01' }),
    ).toEqual({ start: '2026-01-01', end: '2026-08-31' });
    expect(
      analyticsBreakdownPeriod({ from: '2024-02-01', to: '2024-02-01' }),
    ).toEqual({ start: '2024-02-01', end: '2024-02-29' });
  });
});

describe('toInsightAccounts', () => {
  it('merges currencies of one account and uses the absolute difference', () => {
    const accounts = toInsightAccounts([
      {
        id: '1',
        name: 'Food',
        difference: '-10.00',
        currency_code: 'eur',
      },
      { id: '1', name: 'Food', difference: '4.00', currency_code: 'USD' },
    ]);

    expect(accounts).toEqual([
      {
        id: '1',
        name: 'Food',
        amounts: [
          { amount: 10, fromCode: 'EUR' },
          { amount: 4, fromCode: 'USD' },
        ],
      },
    ]);
    expect(
      rankAnalyticsBreakdown({ expenses: accounts, incomes: [] }, euro, [
        usdRate,
      ]).expenses,
    ).toEqual({
      total: 18,
      items: [{ id: '1', name: 'Food', amount: 18, percent: '100%' }],
    });
  });

  it('skips a row with an empty id, empty name, or non-numeric difference', () => {
    const entries: InsightGroupEntry[] = [
      { id: '', name: 'Nope', difference: '1', currency_code: 'EUR' },
      { id: '1', name: ' ', difference: '1', currency_code: 'EUR' },
      { id: '2', name: 'Bad', difference: 'x', currency_code: 'EUR' },
      { id: '3', name: 'No code', difference: '5' },
      { id: '4', name: 'Ok', difference: '2', currency_code: 'EUR' },
    ];

    expect(toInsightAccounts(entries)).toEqual([account('4', 'Ok', 2)]);
  });
});

describe('rankAnalyticsBreakdown', () => {
  it('sorts by amount and shows each share as a rounded percent', () => {
    expect(
      rankAnalyticsBreakdown(
        {
          expenses: [account('food', 'Food', 10), account('rent', 'Rent', 30)],
          incomes: [],
        },
        euro,
        [],
      ).expenses,
    ).toEqual({
      total: 40,
      items: [
        { id: 'rent', name: 'Rent', amount: 30, percent: '75%' },
        { id: 'food', name: 'Food', amount: 10, percent: '25%' },
      ],
    });
  });

  it('omits a zero share', () => {
    expect(
      rankAnalyticsBreakdown(
        {
          expenses: [account('food', 'Food', 0), account('rent', 'Rent', 10)],
          incomes: [],
        },
        euro,
        [],
      ).expenses,
    ).toEqual({
      total: 10,
      items: [{ id: 'rent', name: 'Rent', amount: 10, percent: '100%' }],
    });
  });

  it('counts every non-zero share in the same total', () => {
    const side = rankAnalyticsBreakdown(
      {
        expenses: [
          account('rent', 'Rent', 100),
          account('food', 'Food', 0.4),
          account('cafe', 'Cafe', 0.4),
        ],
        incomes: [],
      },
      euro,
      [],
    ).expenses;

    expect(side.items).toEqual([
      { id: 'rent', name: 'Rent', amount: 100, percent: '99%' },
      { id: 'food', name: 'Food', amount: 0.4, percent: '0.4%' },
      { id: 'cafe', name: 'Cafe', amount: 0.4, percent: '0.4%' },
    ]);
    expect(side.total).toBe(
      side.items.reduce((sum, item) => sum + item.amount, 0),
    );
  });

  it('writes a share below one percent with one decimal', () => {
    expect(
      rankAnalyticsBreakdown(
        {
          expenses: [
            account('rent', 'Rent', 100),
            account('crumb', 'Crumb', 0.01),
          ],
          incomes: [],
        },
        euro,
        [],
      ).expenses.items.map((item) => item.percent),
    ).toEqual(['100%', '<0.1%']);
  });

  it('returns an empty side when one amount has no rate', () => {
    const ranked = rankAnalyticsBreakdown(
      {
        expenses: [
          account('food', 'Food', 10),
          account('trip', 'Trip', 5, 'USD'),
        ],
        incomes: [account('job', 'Job', 40)],
      },
      euro,
      [],
    );

    expect(ranked.expenses).toEqual({ total: null, items: [] });
    expect(ranked.incomes).toEqual({
      total: 40,
      items: [{ id: 'job', name: 'Job', amount: 40, percent: '100%' }],
    });
  });
});
