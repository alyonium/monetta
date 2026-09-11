import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listAccount, listPreference } from '@/api/sdk.gen.ts';
import { ACCOUNT_TYPE, FIREFLY_ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  ACCOUNTS_PAGE_LIMIT,
  PREFERENCES_PAGE_LIMIT,
} from '@/modules/budget/constants/queries.ts';
import { fetchBudgetAccounts } from '@/modules/budget/helpers/fetchBudgetAccounts.ts';
import {
  createAccountPageResult,
  createEmptyPreferences,
  createFireflyAccount,
  createPreference,
  createPreferencePageResult,
  orderPreferenceKey,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listAccount: vi.fn(),
  listPreference: vi.fn(),
}));

const listAccountMock = vi.mocked(listAccount);
const listPreferenceMock = vi.mocked(listPreference);
const BALANCE_DATE = '2026-09-07';

describe('fetchBudgetAccounts', () => {
  beforeEach(() => {
    listAccountMock.mockReset();
    listPreferenceMock.mockReset();
    listPreferenceMock.mockResolvedValue(createEmptyPreferences());
  });

  it('sends date on every account page and orders by preferences', async () => {
    listAccountMock
      .mockResolvedValueOnce(
        createAccountPageResult(
          [
            createFireflyAccount('5', FIREFLY_ACCOUNT_TYPE.REVENUE, 'Salary'),
            createFireflyAccount('2', FIREFLY_ACCOUNT_TYPE.ASSET, 'Wallet'),
          ],
          { current_page: 1, total_pages: 2 },
        ),
      )
      .mockResolvedValueOnce(
        createAccountPageResult(
          [
            createFireflyAccount('1', FIREFLY_ACCOUNT_TYPE.REVENUE, 'Bonus'),
            createFireflyAccount('8', FIREFLY_ACCOUNT_TYPE.ASSET, 'Bank'),
          ],
          { current_page: 2, total_pages: 2 },
        ),
      );
    listPreferenceMock.mockResolvedValue(
      createPreferencePageResult(
        [
          createPreference('1', orderPreferenceKey(ACCOUNT_TYPE.INCOME), [
            '1',
            '5',
          ]),
          createPreference('2', orderPreferenceKey(ACCOUNT_TYPE.CURRENT), [
            '8',
            '2',
          ]),
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const accounts = await fetchBudgetAccounts(BALANCE_DATE);

    expect(listAccountMock).toHaveBeenCalledTimes(2);
    expect(listAccountMock).toHaveBeenNthCalledWith(1, {
      query: { page: 1, limit: ACCOUNTS_PAGE_LIMIT, date: BALANCE_DATE },
    });
    expect(listAccountMock).toHaveBeenNthCalledWith(2, {
      query: { page: 2, limit: ACCOUNTS_PAGE_LIMIT, date: BALANCE_DATE },
    });
    expect(listPreferenceMock).toHaveBeenCalledWith({
      query: { page: 1, limit: PREFERENCES_PAGE_LIMIT },
    });
    expect(accounts.INCOME.map((account) => account.name)).toEqual([
      'Bonus',
      'Salary',
    ]);
    expect(accounts.CURRENT.map((account) => account.name)).toEqual([
      'Bank',
      'Wallet',
    ]);
  });
});
