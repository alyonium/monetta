import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  ACCOUNT_DETAILS_MONEY,
  accountDetailsHeader,
} from '@/modules/budget/helpers/account/accountDetailsHeader.ts';

describe('accountDetailsHeader', () => {
  it('shows only name and icon for income', () => {
    expect(accountDetailsHeader(ACCOUNT_TYPE.INCOME, false)).toEqual({
      showKind: false,
      money: ACCOUNT_DETAILS_MONEY.NONE,
    });
    expect(accountDetailsHeader(ACCOUNT_TYPE.INCOME, true)).toEqual({
      showKind: false,
      money: ACCOUNT_DETAILS_MONEY.NONE,
    });
  });

  it('shows balance and currency for current', () => {
    expect(accountDetailsHeader(ACCOUNT_TYPE.CURRENT, false)).toEqual({
      showKind: false,
      money: ACCOUNT_DETAILS_MONEY.BALANCE,
    });
  });

  it('shows kind for expense and debt money only when the account is debt', () => {
    expect(accountDetailsHeader(ACCOUNT_TYPE.EXPENSE, false)).toEqual({
      showKind: true,
      money: ACCOUNT_DETAILS_MONEY.NONE,
    });
    expect(accountDetailsHeader(ACCOUNT_TYPE.EXPENSE, true)).toEqual({
      showKind: true,
      money: ACCOUNT_DETAILS_MONEY.DEBT,
    });
  });
});
