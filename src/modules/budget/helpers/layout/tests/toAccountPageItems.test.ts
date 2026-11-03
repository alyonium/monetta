import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { createBudgetAccount } from '@/modules/budget/helpers/account/tests/testHelpers.ts';
import { toAccountPageItems } from '@/modules/budget/helpers/layout/toAccountPageItems.ts';

const createAccount = (id: string) =>
  createBudgetAccount({ id, type: ACCOUNT_TYPE.INCOME });

describe('toAccountPageItems', () => {
  const accounts = [createAccount('1'), createAccount('2')];

  it('keeps Add as the last slot', () => {
    expect(toAccountPageItems(accounts)).toEqual([
      { type: 'account', account: accounts[0] },
      { type: 'account', account: accounts[1] },
      { type: 'add' },
    ]);
  });

  it('lists only accounts while editing', () => {
    expect(toAccountPageItems(accounts, true)).toEqual([
      { type: 'account', account: accounts[0] },
      { type: 'account', account: accounts[1] },
    ]);
  });
});
