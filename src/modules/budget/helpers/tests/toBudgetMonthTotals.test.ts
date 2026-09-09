import { describe, expect, it } from 'vitest';
import type { WalletCurrency } from '@/helpers/currency/types.ts';
import { createExchangeRate } from '@/helpers/currency/tests/testHelpers.ts';
import { toBudgetMonthTotals } from '@/modules/budget/helpers/toBudgetMonthTotals.ts';
import { createCurrentAccount } from './testHelpers.ts';

const euro: WalletCurrency = {
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  decimalPlaces: 2,
};

describe('toBudgetMonthTotals', () => {
  it('returns null totals while primary currency or rates are missing', () => {
    expect(
      toBudgetMonthTotals({
        insights: { income: [], expenses: [] },
        currentAccounts: [],
        primary: undefined,
        rates: [],
      }),
    ).toEqual({
      income: null,
      expenses: null,
      balance: null,
      currency: null,
    });

    expect(
      toBudgetMonthTotals({
        insights: { income: [], expenses: [] },
        currentAccounts: [],
        primary: euro,
        rates: undefined,
      }),
    ).toEqual({
      income: null,
      expenses: null,
      balance: null,
      currency: null,
    });
  });

  it('keeps independent placeholders until each query has data', () => {
    expect(
      toBudgetMonthTotals({
        insights: undefined,
        currentAccounts: undefined,
        primary: euro,
        rates: [],
      }),
    ).toEqual({
      income: null,
      expenses: null,
      balance: null,
      currency: euro,
    });
  });

  it('treats empty insights and current accounts as zero', () => {
    expect(
      toBudgetMonthTotals({
        insights: { income: [], expenses: [] },
        currentAccounts: [],
        primary: euro,
        rates: [],
      }),
    ).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
      currency: euro,
    });
  });

  it('returns null for a total when a rate is missing', () => {
    expect(
      toBudgetMonthTotals({
        insights: {
          income: [{ amount: 10, fromCode: 'USD' }],
          expenses: [],
        },
        currentAccounts: [createCurrentAccount('1', 100, 'EUR')],
        primary: euro,
        rates: [],
      }),
    ).toEqual({
      income: null,
      expenses: 0,
      balance: 100,
      currency: euro,
    });
  });

  it('sums loaded insights and current accounts in the primary currency', () => {
    expect(
      toBudgetMonthTotals({
        insights: {
          income: [{ amount: 10, fromCode: 'EUR' }],
          expenses: [{ amount: 10, fromCode: 'USD' }],
        },
        currentAccounts: [
          createCurrentAccount('1', 100, 'EUR'),
          createCurrentAccount('2', -20, 'EUR'),
        ],
        primary: euro,
        rates: [createExchangeRate('USD', 'EUR', 0.5)],
      }),
    ).toEqual({
      income: 10,
      expenses: 5,
      balance: 80,
      currency: euro,
    });
  });
});
