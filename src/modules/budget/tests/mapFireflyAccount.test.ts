import { describe, expect, it } from 'vitest';
import type { AccountProperties, AccountRead } from '@/api/types.gen.ts';
import { ACCOUNT_TYPE, FIREFLY_ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import { mapFireflyAccount } from '@/modules/budget/helpers/mapFireflyAccount.ts';

const mockAccount = (
  attributes: Partial<AccountProperties> & Pick<AccountProperties, 'type'>,
  id = '1',
): Pick<AccountRead, 'id' | 'attributes'> => ({
  id,
  attributes: {
    name: 'Account',
    ...attributes,
  },
});

describe('mapFireflyAccount', () => {
  it('maps revenue to INCOME', () => {
    expect(
      mapFireflyAccount(
        mockAccount({
          type: FIREFLY_ACCOUNT_TYPE.REVENUE,
          current_balance: '12.5',
          currency_code: 'eur',
          currency_symbol: '€',
        }),
      ),
    ).toEqual({
      id: '1',
      name: 'Account',
      type: ACCOUNT_TYPE.INCOME,
      isDebt: false,
      icon: null,
      color: null,
      balance: 12.5,
      currencyCode: 'EUR',
      currencySymbol: '€',
      debtAmount: null,
      paidAmount: null,
    });
  });

  it('maps liability and liabilities to EXPENSE with debt', () => {
    expect(mapFireflyAccount(mockAccount({ type: FIREFLY_ACCOUNT_TYPE.LIABILITY }))).toMatchObject({
      type: ACCOUNT_TYPE.EXPENSE,
      isDebt: true,
    });
    expect(mapFireflyAccount(mockAccount({ type: FIREFLY_ACCOUNT_TYPE.LIABILITIES }))).toMatchObject({
      type: ACCOUNT_TYPE.EXPENSE,
      isDebt: true,
    });
  });

  it('returns null when the account is inactive', () => {
    expect(
      mapFireflyAccount(mockAccount({ type: FIREFLY_ACCOUNT_TYPE.ASSET, active: false })),
    ).toBeNull();
  });

  it('returns null for unmapped Firefly types', () => {
    expect(mapFireflyAccount(mockAccount({ type: 'cash' }))).toBeNull();
  });

  it('returns null when id or name is empty', () => {
    expect(mapFireflyAccount(mockAccount({ type: FIREFLY_ACCOUNT_TYPE.ASSET }, ''))).toBeNull();
    expect(
      mapFireflyAccount(mockAccount({ type: FIREFLY_ACCOUNT_TYPE.ASSET, name: '  ' })),
    ).toBeNull();
  });

  it('uses appearance icon and color when provided', () => {
    expect(
      mapFireflyAccount(mockAccount({ type: FIREFLY_ACCOUNT_TYPE.REVENUE }), {
        icon: 'PiggyBank',
        color: '#FA5252',
      }),
    ).toMatchObject({
      icon: 'PiggyBank',
      color: '#FA5252',
    });
  });

  it('falls back to primary currency fields and zero for a bad balance', () => {
    expect(
      mapFireflyAccount(
        mockAccount({
          type: FIREFLY_ACCOUNT_TYPE.ASSET,
          current_balance: 'n/a',
          primary_currency_code: 'usd',
          primary_currency_symbol: '$',
        }),
      ),
    ).toMatchObject({
      balance: 0,
      currencyCode: 'USD',
      currencySymbol: '$',
    });
  });

  it('computes debtAmount and paidAmount from debt_amount and opening_balance', () => {
    expect(
      mapFireflyAccount(
        mockAccount({
          type: FIREFLY_ACCOUNT_TYPE.LIABILITY,
          current_balance: '-80',
          debt_amount: '80',
          opening_balance: '100',
        }),
      ),
    ).toMatchObject({
      isDebt: true,
      balance: -80,
      debtAmount: 80,
      paidAmount: 20,
    });
  });

  it('uses abs(balance) when debt_amount is not finite and paidAmount 0 without opening_balance', () => {
    expect(
      mapFireflyAccount(
        mockAccount({
          type: FIREFLY_ACCOUNT_TYPE.LIABILITY,
          current_balance: '-50',
          debt_amount: 'oops',
        }),
      ),
    ).toMatchObject({
      debtAmount: 50,
      paidAmount: 0,
    });
  });
});
