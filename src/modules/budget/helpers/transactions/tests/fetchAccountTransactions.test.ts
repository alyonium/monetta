import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listTransactionByAccount } from '@/api/sdk.gen.ts';
import {
  ACCOUNT_TRANSACTIONS_MISSING_ERROR,
  ACCOUNT_TRANSACTIONS_PAGE_LIMIT,
} from '@/modules/budget/constants/queries.ts';
import { fetchAccountTransactions } from '@/modules/budget/helpers/transactions/fetchAccountTransactions.ts';
import {
  createFireflyTransaction,
  createRequest,
  createTransactionPageResult,
  createTransactionSplit,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listTransactionByAccount: vi.fn(),
}));

const listTransactionByAccountMock = vi.mocked(listTransactionByAccount);

describe('fetchAccountTransactions', () => {
  beforeEach(() => {
    listTransactionByAccountMock.mockReset();
  });

  it('loads every page for the account without start, end, or type', async () => {
    listTransactionByAccountMock
      .mockResolvedValueOnce(
        createTransactionPageResult(
          [
            createFireflyTransaction('10', [
              createTransactionSplit({
                transaction_journal_id: '101',
                description: 'Coffee',
                source_name: 'Wallet',
                destination_name: 'Cafe',
                amount: '4.5',
                currency_code: 'EUR',
                currency_symbol: '€',
              }),
            ]),
          ],
          { current_page: 1, total_pages: 2 },
        ),
      )
      .mockResolvedValueOnce(
        createTransactionPageResult(
          [
            createFireflyTransaction('11', [
              createTransactionSplit({
                transaction_journal_id: '102',
                date: '2026-02-01T08:00:00+00:00',
                description: 'Rent',
                source_name: 'Wallet',
                destination_name: 'Landlord',
                amount: '800',
                currency_code: 'EUR',
                currency_symbol: '€',
              }),
            ]),
          ],
          { current_page: 2, total_pages: 2 },
        ),
      );

    const items = await fetchAccountTransactions('42');

    expect(listTransactionByAccountMock).toHaveBeenCalledTimes(2);
    expect(listTransactionByAccountMock).toHaveBeenNthCalledWith(1, {
      path: { id: '42' },
      query: { page: 1, limit: ACCOUNT_TRANSACTIONS_PAGE_LIMIT },
    });
    expect(listTransactionByAccountMock).toHaveBeenNthCalledWith(2, {
      path: { id: '42' },
      query: { page: 2, limit: ACCOUNT_TRANSACTIONS_PAGE_LIMIT },
    });
    expect(items.map((item) => item.journalId)).toEqual(['101', '102']);
  });

  it('returns an empty list when data is empty', async () => {
    listTransactionByAccountMock.mockResolvedValue(
      createTransactionPageResult([], { current_page: 1, total_pages: 1 }),
    );

    await expect(fetchAccountTransactions('42')).resolves.toEqual([]);
  });

  it('throws when data is missing', async () => {
    listTransactionByAccountMock.mockResolvedValue({
      data: undefined,
      error: { message: 'Server error' },
      request: createRequest('accounts/1/transactions'),
      response: new Response(null, { status: 500 }),
    });

    await expect(fetchAccountTransactions('42')).rejects.toEqual(
      new Error(ACCOUNT_TRANSACTIONS_MISSING_ERROR),
    );
  });
});
