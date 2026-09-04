import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listAccount, listPreference } from '@/api/sdk.gen.ts';
import { UNAUTHENTICATED_ERROR_MESSAGE } from '@/helpers/currency/constants.ts';
import {
  ACCOUNT_TYPE,
  ACCOUNTS_MISSING_ERROR,
  ACCOUNTS_PAGE_LIMIT,
  FIREFLY_ACCOUNT_TYPE,
  PREFERENCES_PAGE_LIMIT,
} from '@/modules/budget/constants.ts';
import { fetchBudgetAccounts } from '@/modules/budget/helpers/fetchBudgetAccounts.ts';
import {
  createAccountPageResult,
  createEmptyPreferences,
  createFireflyAccount,
  createPreference,
  createPreferencePageResult,
  createRequest,
} from '@/modules/budget/tests/helpers.ts';
import { orderPreferenceKey } from '@/modules/budget/tests/preferenceKeyFixture.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listAccount: vi.fn(),
  listPreference: vi.fn(),
}));

const listAccountMock = vi.mocked(listAccount);
const listPreferenceMock = vi.mocked(listPreference);

describe('fetchBudgetAccounts', () => {
  beforeEach(() => {
    listAccountMock.mockReset();
    listPreferenceMock.mockReset();
    listPreferenceMock.mockResolvedValue(createEmptyPreferences());
  });

  it('pages accounts, applies order prefs, and puts debt in expense', async () => {
    listAccountMock
      .mockResolvedValueOnce(
        createAccountPageResult(
          [
            createFireflyAccount('5', FIREFLY_ACCOUNT_TYPE.REVENUE, 'Salary'),
            createFireflyAccount('2', FIREFLY_ACCOUNT_TYPE.ASSET, 'Wallet'),
            createFireflyAccount(
              '3',
              FIREFLY_ACCOUNT_TYPE.EXPENSE,
              'Groceries',
            ),
            createFireflyAccount('4', FIREFLY_ACCOUNT_TYPE.LIABILITY, 'Loan'),
            createFireflyAccount('9', 'cash', 'Petty cash'),
            createFireflyAccount('10', FIREFLY_ACCOUNT_TYPE.ASSET, 'Hidden', {
              active: false,
            }),
          ],
          { current_page: 1, total_pages: 2 },
        ),
      )
      .mockResolvedValueOnce(
        createAccountPageResult(
          [
            createFireflyAccount('1', FIREFLY_ACCOUNT_TYPE.REVENUE, 'Bonus'),
            createFireflyAccount('8', FIREFLY_ACCOUNT_TYPE.ASSET, 'Bank'),
            createFireflyAccount('7', FIREFLY_ACCOUNT_TYPE.EXPENSE, 'Rent'),
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
          createPreference('3', orderPreferenceKey(ACCOUNT_TYPE.EXPENSE), [
            '4',
            '3',
          ]),
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const accounts = await fetchBudgetAccounts();

    expect(listAccountMock).toHaveBeenCalledTimes(2);
    expect(listAccountMock).toHaveBeenNthCalledWith(1, {
      query: { page: 1, limit: ACCOUNTS_PAGE_LIMIT },
    });
    expect(listAccountMock).toHaveBeenNthCalledWith(2, {
      query: { page: 2, limit: ACCOUNTS_PAGE_LIMIT },
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
    expect(accounts.EXPENSE.map((account) => account.name)).toEqual([
      'Loan',
      'Groceries',
      'Rent',
    ]);
    expect(accounts.EXPENSE.map((account) => account.isDebt)).toEqual([
      true,
      false,
      false,
    ]);
  });

  it('returns empty blocks when account data is an empty list', async () => {
    listAccountMock.mockResolvedValue(
      createAccountPageResult([], { current_page: 1, total_pages: 1 }),
    );

    const accounts = await fetchBudgetAccounts();

    expect(accounts).toEqual({
      [ACCOUNT_TYPE.INCOME]: [],
      [ACCOUNT_TYPE.CURRENT]: [],
      [ACCOUNT_TYPE.EXPENSE]: [],
    });
  });

  it('throws when account data is missing', async () => {
    listAccountMock.mockResolvedValue({
      data: undefined,
      error: { message: UNAUTHENTICATED_ERROR_MESSAGE },
      request: createRequest('accounts'),
      response: new Response(null, { status: 401 }),
    });

    let missingDataError: Error | undefined;

    try {
      await fetchBudgetAccounts();
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(ACCOUNTS_MISSING_ERROR));
  });
});
