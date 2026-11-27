import { describe, expect, it } from 'vitest';
import { segmentColorById } from '@/modules/analytics/helpers/expenseBreakdownChart.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { DEFAULT_ACCOUNT_COLOR } from '@/modules/budget/constants/appearance.ts';
import {
  BudgetAccount,
  BudgetAccountsByBlock,
} from '@/modules/budget/types/budgetAccount.ts';

const account = (id: string, color: string | null): BudgetAccount => ({
  id,
  name: id,
  type: ACCOUNT_TYPE.EXPENSE,
  isDebt: false,
  icon: null,
  color,
  balance: 0,
  currencyCode: 'EUR',
  currencySymbol: '€',
  debtAmount: null,
  paidAmount: null,
});

const accounts = (expense: BudgetAccount[]): BudgetAccountsByBlock => ({
  [ACCOUNT_TYPE.INCOME]: [],
  [ACCOUNT_TYPE.CURRENT]: [],
  [ACCOUNT_TYPE.EXPENSE]: expense,
});

const items = (...ids: string[]) => ids.map((id) => ({ id }));

describe('segmentColorById', () => {
  it('keeps an account color that is still free', () => {
    const colors = segmentColorById(
      accounts([account('rent', '#FA5252'), account('food', '#40C057')]),
      items('rent', 'food'),
    );

    expect(colors.get('rent')).toBe('#FA5252');
    expect(colors.get('food')).toBe('#40C057');
  });

  it('gives a repeated account color a different one', () => {
    const colors = segmentColorById(
      accounts([
        account('a', '#FA5252'),
        account('b', '#FA5252'),
        account('c', '#FA5252'),
      ]),
      items('a', 'b', 'c'),
    );
    const values = [...colors.values()];

    expect(values[0]).toBe('#FA5252');
    expect(new Set(values.map((color) => color.toLowerCase())).size).toBe(3);
  });

  it('treats a different letter case as the same color', () => {
    const colors = segmentColorById(
      accounts([account('a', '#4C6EF5'), account('b', '#4c6ef5')]),
      items('a', 'b'),
    );

    expect(colors.get('a')?.toLowerCase()).not.toBe(
      colors.get('b')?.toLowerCase(),
    );
  });

  it('uses the default once when accounts have no color', () => {
    const colors = segmentColorById(
      accounts([account('a', null), account('b', null)]),
      items('a', 'b'),
    );
    const values = [...colors.values()];

    expect(values[0]).toBe(DEFAULT_ACCOUNT_COLOR);
    expect(values[1]?.toLowerCase()).not.toBe(
      DEFAULT_ACCOUNT_COLOR.toLowerCase(),
    );
  });
});
