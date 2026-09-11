import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { toAccountUpdateBody } from '@/modules/budget/helpers/toAccountUpdateBody.ts';

const OPENING_DATE = '2026-09-11';

describe('toAccountUpdateBody', () => {
  it('trims the name and omits the balance for income', () => {
    expect(
      toAccountUpdateBody({
        accountType: ACCOUNT_TYPE.INCOME,
        name: '  Salary  ',
        balance: 10,
        openingBalanceDate: OPENING_DATE,
      }),
    ).toEqual({ name: 'Salary' });
  });

  it('sends opening_balance and opening_balance_date for current', () => {
    expect(
      toAccountUpdateBody({
        accountType: ACCOUNT_TYPE.CURRENT,
        name: 'Wallet',
        balance: 12.5,
        openingBalanceDate: OPENING_DATE,
      }),
    ).toEqual({
      name: 'Wallet',
      opening_balance: '12.5',
      opening_balance_date: OPENING_DATE,
    });
  });
});
