import { describe, expect, it } from 'vitest';
import {
  ACCOUNT_TYPE,
  FIREFLY_ACCOUNT_ROLE,
  FIREFLY_ACCOUNT_TYPE,
  FIREFLY_LIABILITY_DIRECTION,
  FIREFLY_LIABILITY_INTEREST,
  FIREFLY_LIABILITY_INTEREST_PERIOD,
  FIREFLY_LIABILITY_TYPE,
} from '@/modules/budget/constants.ts';
import { toAccountStoreBody } from '@/modules/budget/helpers/toAccountStoreBody.ts';

const OPENING_DATE = '2026-09-09';

describe('toAccountStoreBody', () => {
  it('maps income to a revenue body with a trimmed name and no money fields', () => {
    expect(
      toAccountStoreBody({
        accountType: ACCOUNT_TYPE.INCOME,
        name: '  Salary  ',
        isDebt: false,
        currency: 'EUR',
        initialBalance: 10,
        openingBalanceDate: OPENING_DATE,
      }),
    ).toEqual({
      name: 'Salary',
      type: FIREFLY_ACCOUNT_TYPE.REVENUE,
    });
  });

  it('maps current to an asset with defaultAsset, currency, and opening balance', () => {
    expect(
      toAccountStoreBody({
        accountType: ACCOUNT_TYPE.CURRENT,
        name: 'Wallet',
        isDebt: false,
        currency: 'USD',
        initialBalance: 12.5,
        openingBalanceDate: OPENING_DATE,
      }),
    ).toEqual({
      name: 'Wallet',
      type: FIREFLY_ACCOUNT_TYPE.ASSET,
      account_role: FIREFLY_ACCOUNT_ROLE.DEFAULT_ASSET,
      currency_code: 'USD',
      opening_balance: '12.5',
      opening_balance_date: OPENING_DATE,
    });
  });

  it('maps expense to an expense body with only the name', () => {
    expect(
      toAccountStoreBody({
        accountType: ACCOUNT_TYPE.EXPENSE,
        name: 'Groceries',
        isDebt: false,
        currency: 'EUR',
        initialBalance: 5,
        openingBalanceDate: OPENING_DATE,
      }),
    ).toEqual({
      name: 'Groceries',
      type: FIREFLY_ACCOUNT_TYPE.EXPENSE,
    });
  });

  it('maps debt to a liability with Firefly defaults, currency, and opening balance', () => {
    expect(
      toAccountStoreBody({
        accountType: ACCOUNT_TYPE.EXPENSE,
        name: 'Loan',
        isDebt: true,
        currency: 'EUR',
        initialBalance: 0,
        openingBalanceDate: OPENING_DATE,
      }),
    ).toEqual({
      name: 'Loan',
      type: FIREFLY_ACCOUNT_TYPE.LIABILITY,
      liability_type: FIREFLY_LIABILITY_TYPE.DEBT,
      liability_direction: FIREFLY_LIABILITY_DIRECTION.DEBIT,
      interest: FIREFLY_LIABILITY_INTEREST,
      interest_period: FIREFLY_LIABILITY_INTEREST_PERIOD.MONTHLY,
      currency_code: 'EUR',
      opening_balance: '0',
      opening_balance_date: OPENING_DATE,
    });
  });
});
