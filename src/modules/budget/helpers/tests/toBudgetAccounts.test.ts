import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE, FIREFLY_ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import { toBudgetAccounts } from '@/modules/budget/helpers/toBudgetAccounts.ts';
import type { AccountPreferences } from '@/modules/budget/types/budgetAccount.ts';
import { createFireflyAccount } from './testHelpers.ts';

const emptyPreferences = (): AccountPreferences => ({
  appearanceById: {},
  orderByBlock: {
    [ACCOUNT_TYPE.INCOME]: [],
    [ACCOUNT_TYPE.CURRENT]: [],
    [ACCOUNT_TYPE.EXPENSE]: [],
  },
});

describe('toBudgetAccounts', () => {
  it('splits Firefly accounts into income, current, and expense blocks', () => {
    const result = toBudgetAccounts(
      [
        createFireflyAccount('1', FIREFLY_ACCOUNT_TYPE.REVENUE, 'Salary'),
        createFireflyAccount('2', FIREFLY_ACCOUNT_TYPE.ASSET, 'Cash'),
        createFireflyAccount('3', FIREFLY_ACCOUNT_TYPE.EXPENSE, 'Groceries'),
        createFireflyAccount('4', FIREFLY_ACCOUNT_TYPE.LIABILITY, 'Loan'),
        createFireflyAccount('5', 'cash', 'Skip'),
        {
          id: '6',
          attributes: {
            name: 'Hidden',
            type: FIREFLY_ACCOUNT_TYPE.ASSET,
            active: false,
          },
        },
      ],
      emptyPreferences(),
    );

    expect(result.INCOME.map((account) => account.id)).toEqual(['1']);
    expect(result.CURRENT.map((account) => account.id)).toEqual(['2']);
    expect(result.EXPENSE.map((account) => account.id)).toEqual(['3', '4']);
    expect(result.EXPENSE.map((account) => account.isDebt)).toEqual([
      false,
      true,
    ]);
  });

  it('reorders each block by preference and appends unordered accounts', () => {
    const result = toBudgetAccounts(
      [
        createFireflyAccount('1', FIREFLY_ACCOUNT_TYPE.REVENUE),
        createFireflyAccount('5', FIREFLY_ACCOUNT_TYPE.REVENUE),
        createFireflyAccount('3', FIREFLY_ACCOUNT_TYPE.REVENUE),
        createFireflyAccount('9', FIREFLY_ACCOUNT_TYPE.REVENUE),
      ],
      {
        appearanceById: {},
        orderByBlock: {
          [ACCOUNT_TYPE.INCOME]: ['3', 'missing', '1', '1'],
          [ACCOUNT_TYPE.CURRENT]: [],
          [ACCOUNT_TYPE.EXPENSE]: [],
        },
      },
    );

    expect(result.INCOME.map((account) => account.id)).toEqual([
      '3',
      '1',
      '5',
      '9',
    ]);
  });
});
