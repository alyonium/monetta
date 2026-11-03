import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { reorderBlock } from '@/modules/budget/helpers/account/reorderBlock.ts';
import { createBudgetAccount } from '@/modules/budget/helpers/account/tests/testHelpers.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

const createAccount = (id: string, type: AccountType = ACCOUNT_TYPE.CURRENT) =>
  createBudgetAccount({ id, type });

describe('reorderBlock', () => {
  it('moves an account inside the list and leaves the others in place', () => {
    const accounts = ['1', '2', '3', '4'].map((id) => createAccount(id));

    expect(
      reorderBlock(accounts, accounts[1], accounts[2])?.map(
        (account) => account.id,
      ),
    ).toEqual(['1', '3', '2', '4']);
  });

  it('returns null for the same id, a different type, or a missing id', () => {
    const accounts = [createAccount('1'), createAccount('2')];
    const income = createAccount('1', ACCOUNT_TYPE.INCOME);
    const current = createAccount('2', ACCOUNT_TYPE.CURRENT);
    const missing = createAccount('9');

    expect(reorderBlock(accounts, accounts[0], accounts[0])).toBeNull();
    expect(reorderBlock([income, current], income, current)).toBeNull();
    expect(reorderBlock(accounts, missing, accounts[0])).toBeNull();
  });
});
