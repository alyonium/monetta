import { describe, expect, it } from 'vitest';
import { createAccountVisibility } from '@/modules/budget/helpers/account/createAccountVisibility.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';

describe('createAccountVisibility', () => {
  it('hides kind and money for income', () => {
    expect(createAccountVisibility(ACCOUNT_TYPE.INCOME, false)).toEqual({
      showKind: false,
      showMoney: false,
    });
    expect(createAccountVisibility(ACCOUNT_TYPE.INCOME, true)).toEqual({
      showKind: false,
      showMoney: false,
    });
  });

  it('shows money without kind for current', () => {
    expect(createAccountVisibility(ACCOUNT_TYPE.CURRENT, false)).toEqual({
      showKind: false,
      showMoney: true,
    });
  });

  it('shows kind for expense and money only when debt is selected', () => {
    expect(createAccountVisibility(ACCOUNT_TYPE.EXPENSE, false)).toEqual({
      showKind: true,
      showMoney: false,
    });
    expect(createAccountVisibility(ACCOUNT_TYPE.EXPENSE, true)).toEqual({
      showKind: true,
      showMoney: true,
    });
  });
});
