import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listTransaction, listTransactionByTag } from '@/api/sdk.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import {
  HISTORY_TRANSACTIONS_MISSING_ERROR,
  HISTORY_TRANSACTIONS_PAGE_LIMIT,
} from '@/modules/history/constants/queries.ts';
import { fetchHistoryTransactionsPage } from '@/modules/history/helpers/fetchHistoryTransactionsPage.ts';
import { HistoryTransactionsQuery } from '@/modules/history/types/historyFilters.ts';
import {
  createFireflyTransaction,
  createTransactionPageResult,
  createTransactionSplit,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listTransaction: vi.fn(),
  listTransactionByTag: vi.fn(),
}));

const listTransactionMock = vi.mocked(listTransaction);
const listTransactionByTagMock = vi.mocked(listTransactionByTag);

const defaultQuery: HistoryTransactionsQuery = { tag: null };

describe('fetchHistoryTransactionsPage', () => {
  beforeEach(() => {
    listTransactionMock.mockReset();
    listTransactionByTagMock.mockReset();
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

    const page = await fetchHistoryTransactionsPage(2, defaultQuery);

    expect(listTransactionMock).toHaveBeenCalledTimes(1);
    expect(listTransactionByTagMock).not.toHaveBeenCalled();
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

    await expect(fetchHistoryTransactionsPage(1, defaultQuery)).resolves.toEqual({
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

    const page = await fetchHistoryTransactionsPage(3, defaultQuery);

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

    await expect(fetchHistoryTransactionsPage(1, defaultQuery)).rejects.toEqual(
      new Error(HISTORY_TRANSACTIONS_MISSING_ERROR),
    );
  });

  it('rethrows an Error and wraps any other throw', async () => {
    listTransactionMock.mockRejectedValueOnce(new Error('network'));

    await expect(fetchHistoryTransactionsPage(1, defaultQuery)).rejects.toEqual(
      new Error('network'),
    );

    listTransactionMock.mockRejectedValueOnce('nope');

    await expect(fetchHistoryTransactionsPage(1, defaultQuery)).rejects.toEqual(
      new Error(HISTORY_TRANSACTIONS_MISSING_ERROR),
    );
  });

  it('sends start, end, and type on listTransaction', async () => {
    listTransactionMock.mockResolvedValue(
      createTransactionPageResult([], { current_page: 1, total_pages: 1 }),
    );

    await fetchHistoryTransactionsPage(1, {
      start: '2026-11-01',
      end: '2026-11-30',
      type: 'withdrawal',
      tag: null,
    });

    expect(listTransactionMock).toHaveBeenCalledWith({
      query: {
        page: 1,
        limit: HISTORY_TRANSACTIONS_PAGE_LIMIT,
        start: '2026-11-01',
        end: '2026-11-30',
        type: 'withdrawal',
      },
    });
    expect(listTransactionByTagMock).not.toHaveBeenCalled();
  });

  it('loads a tagged page from listTransactionByTag', async () => {
    listTransactionByTagMock.mockResolvedValue(
      createTransactionPageResult(
        [
          createFireflyTransaction('10', [
            createTransactionSplit({ transaction_journal_id: '101' }),
          ]),
        ],
        { current_page: 2, total_pages: 4 },
      ),
    );

    const page = await fetchHistoryTransactionsPage(2, {
      start: '2026-01-01',
      end: '2026-01-31',
      type: 'deposit',
      tag: 'Groceries',
    });

    expect(listTransactionByTagMock).toHaveBeenCalledWith({
      path: { tag: 'Groceries' },
      query: {
        page: 2,
        limit: HISTORY_TRANSACTIONS_PAGE_LIMIT,
        start: '2026-01-01',
        end: '2026-01-31',
        type: 'deposit',
      },
    });
    expect(listTransactionMock).not.toHaveBeenCalled();
    expect(page.items.map((item) => item.journalId)).toEqual(['101']);
    expect(page.totalPages).toBe(4);
  });
});
