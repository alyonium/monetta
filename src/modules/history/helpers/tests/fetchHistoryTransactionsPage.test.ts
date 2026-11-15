import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listTransaction } from '@/api/sdk.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import {
  HISTORY_TRANSACTIONS_MISSING_ERROR,
  HISTORY_TRANSACTIONS_PAGE_LIMIT,
} from '@/modules/history/constants/queries.ts';
import { fetchHistoryTransactionsPage } from '@/modules/history/helpers/fetchHistoryTransactionsPage.ts';
import {
  createFireflyTransaction,
  createTransactionPageResult,
  createTransactionSplit,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listTransaction: vi.fn(),
}));

const listTransactionMock = vi.mocked(listTransaction);

describe('fetchHistoryTransactionsPage', () => {
  beforeEach(() => {
    listTransactionMock.mockReset();
  });

  it('loads one page of groups with limit 10 and no start, end, or type', async () => {
    expect(HISTORY_TRANSACTIONS_PAGE_LIMIT).toBe(10);

    listTransactionMock.mockResolvedValue(
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
            createTransactionSplit({
              transaction_journal_id: '102',
              description: 'Tip',
              source_name: 'Wallet',
              destination_name: 'Cafe',
              amount: '1',
              currency_code: 'EUR',
              currency_symbol: '€',
            }),
          ]),
        ],
        { current_page: 4, total_pages: 3 },
      ),
    );

    const page = await fetchHistoryTransactionsPage(2);

    expect(listTransactionMock).toHaveBeenCalledTimes(1);
    expect(listTransactionMock).toHaveBeenCalledWith({
      query: { page: 2, limit: HISTORY_TRANSACTIONS_PAGE_LIMIT },
    });
    expect(page.page).toBe(2);
    expect(page.totalPages).toBe(3);
    expect(page.items.map((item) => item.journalId)).toEqual(['101', '102']);
  });

  it('returns an empty list when data is empty', async () => {
    listTransactionMock.mockResolvedValue(
      createTransactionPageResult([], { current_page: 1, total_pages: 1 }),
    );

    await expect(fetchHistoryTransactionsPage(1)).resolves.toEqual({
      items: [],
      page: 1,
      totalPages: 1,
    });
  });

  it('treats a missing pagination meta as the last page', async () => {
    listTransactionMock.mockResolvedValue(
      createTransactionPageResult([
        createFireflyTransaction('10', [
          createTransactionSplit({ transaction_journal_id: '101' }),
        ]),
      ]),
    );

    const page = await fetchHistoryTransactionsPage(3);

    expect(page.page).toBe(3);
    expect(page.totalPages).toBe(3);
    expect(page.items).toHaveLength(1);
  });

  it('throws when data is missing', async () => {
    listTransactionMock.mockResolvedValue({
      data: undefined,
      error: { message: 'Server error' },
      request: createFireflyRequest('transactions'),
      response: new Response(null, { status: 500 }),
    });

    await expect(fetchHistoryTransactionsPage(1)).rejects.toEqual(
      new Error(HISTORY_TRANSACTIONS_MISSING_ERROR),
    );
  });

  it('rethrows an Error and wraps any other throw', async () => {
    listTransactionMock.mockRejectedValueOnce(new Error('network'));

    await expect(fetchHistoryTransactionsPage(1)).rejects.toEqual(
      new Error('network'),
    );

    listTransactionMock.mockRejectedValueOnce('nope');

    await expect(fetchHistoryTransactionsPage(1)).rejects.toEqual(
      new Error(HISTORY_TRANSACTIONS_MISSING_ERROR),
    );
  });
});
