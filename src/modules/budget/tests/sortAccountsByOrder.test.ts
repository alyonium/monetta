import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import { sortAccountsByOrder } from '@/modules/budget/helpers/sortAccountsByOrder.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

const mockAccount = (id: string, name = id): BudgetAccount => ({
  id,
  name,
  type: ACCOUNT_TYPE.CURRENT,
  isDebt: false,
  icon: null,
  color: null,
  balance: 0,
  currencyCode: 'EUR',
  currencySymbol: '€',
  debtAmount: null,
  paidAmount: null,
});

describe('sortAccountsByOrder', () => {
  it('orders known ids first and keeps the rest in original order', () => {
    const accounts = [mockAccount('1'), mockAccount('2'), mockAccount('3'), mockAccount('4')];

    expect(sortAccountsByOrder(accounts, ['3', '1'])).toEqual([
      mockAccount('3'),
      mockAccount('1'),
      mockAccount('2'),
      mockAccount('4'),
    ]);
  });

  it('ignores unknown ids and duplicate order entries', () => {
    const accounts = [mockAccount('1'), mockAccount('2')];

    expect(sortAccountsByOrder(accounts, ['9', '2', '2', '1'])).toEqual([
      mockAccount('2'),
      mockAccount('1'),
    ]);
  });
});
