import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { liveBudgetAccount } from '@/modules/budget/helpers/account/liveBudgetAccount.ts';
import { createCurrentAccount } from './testHelpers.ts';

const emptyAccounts = {
  [ACCOUNT_TYPE.INCOME]: [],
  [ACCOUNT_TYPE.CURRENT]: [],
  [ACCOUNT_TYPE.EXPENSE]: [],
};

describe('liveBudgetAccount', () => {
  it('prefers the cached account with the same id', () => {
    const session = { ...createCurrentAccount('99', 0, 'EUR'), name: 'Old' };
    const cached = { ...createCurrentAccount('99', 0, 'EUR'), name: 'New' };

    expect(
      liveBudgetAccount(
        { ...emptyAccounts, [ACCOUNT_TYPE.CURRENT]: [cached] },
        session,
      ),
    ).toBe(cached);
  });

  it('falls back to the session account when the cache has no match', () => {
    const session = createCurrentAccount('99', 0, 'EUR');

    expect(liveBudgetAccount(undefined, session)).toBe(session);
    expect(liveBudgetAccount(emptyAccounts, session)).toBe(session);
  });
});
