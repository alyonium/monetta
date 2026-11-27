import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listTransaction, listTransactionByTag } from '@/api/sdk.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import {
  ANALYTICS_CHART_MISSING_ERROR,
  ANALYTICS_CHART_PAGE_LIMIT,
} from '@/modules/analytics/constants/queries.ts';
import { fetchAnalyticsChart } from '@/modules/analytics/helpers/fetchAnalyticsChart.ts';
import {
  createFireflyTransaction,
  createTransactionPageResult,
  createTransactionSplit,
} from '@/modules/history/helpers/tests/testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listTransaction: vi.fn(),
  listTransactionByTag: vi.fn(),
}));

const listTransactionMock = vi.mocked(listTransaction);
const listTransactionByTagMock = vi.mocked(listTransactionByTag);

const RANGE = { from: '2026-01-01', to: '2026-03-01' };
const START = '2026-01-01';
const END = '2026-03-31';

describe('fetchAnalyticsChart', () => {
  beforeEach(() => {
    listTransactionMock.mockReset();
    listTransactionByTagMock.mockReset();
  });

  it('loads every month through listTransaction when no tag is selected', async () => {
    listTransactionMock.mockResolvedValue(
      createTransactionPageResult([
        createFireflyTransaction('10', [
          createTransactionSplit({
            transaction_journal_id: '101',
            type: 'withdrawal',
            date: '2026-01-15T12:00:00+00:00',
            amount: '12.00',
            currency_code: 'EUR',
            foreign_amount: '99.00',
          }),
          createTransactionSplit({
            transaction_journal_id: '102',
            type: 'deposit',
            date: '2026-03-02T12:00:00+00:00',
            source_id: '4',
            source_name: 'Job',
            amount: '40.00',
            currency_code: 'USD',
          }),
          createTransactionSplit({
            transaction_journal_id: '103',
            type: 'transfer',
            date: '2026-02-01T12:00:00+00:00',
            amount: '15.00',
            currency_code: 'EUR',
          }),
        ]),
      ]),
    );

    await expect(fetchAnalyticsChart(RANGE, null)).resolves.toEqual([
      {
        month: '2026-01-01',
        expenses: [{ amount: 12, fromCode: 'EUR' }],
        incomes: [],
      },
      { month: '2026-02-01', expenses: [], incomes: [] },
      {
        month: '2026-03-01',
        expenses: [],
        incomes: [{ amount: 40, fromCode: 'USD' }],
      },
    ]);
    expect(listTransactionMock).toHaveBeenCalledWith({
      query: {
        page: 1,
        limit: ANALYTICS_CHART_PAGE_LIMIT,
        start: START,
        end: END,
      },
    });
    expect(listTransactionByTagMock).not.toHaveBeenCalled();
  });

  it('keeps every month when the page is empty', async () => {
    listTransactionMock.mockResolvedValue(createTransactionPageResult([]));

    const months = await fetchAnalyticsChart(RANGE, null);

    expect(months.map((month) => month.month)).toEqual([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
    ]);
    expect(months.every((month) => month.expenses.length === 0)).toBe(true);
    expect(months.every((month) => month.incomes.length === 0)).toBe(true);
  });

  it('throws when transaction data is missing', async () => {
    listTransactionMock.mockResolvedValue({
      data: undefined,
      error: { message: 'Unauthenticated' },
      request: createFireflyRequest('transactions'),
      response: new Response(null, { status: 401 }),
    });

    await expect(fetchAnalyticsChart(RANGE, null)).rejects.toEqual(
      new Error(ANALYTICS_CHART_MISSING_ERROR),
    );
  });

  it('loads a tagged range from listTransactionByTag', async () => {
    listTransactionByTagMock
      .mockResolvedValueOnce(
        createTransactionPageResult(
          [
            createFireflyTransaction('10', [
              createTransactionSplit({
                transaction_journal_id: '101',
                type: 'withdrawal',
                date: '2026-01-15T12:00:00+00:00',
                amount: '12.00',
                currency_code: 'EUR',
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
                type: 'deposit',
                date: '2026-03-02T12:00:00+00:00',
                amount: '40.00',
                currency_code: 'USD',
              }),
            ]),
          ],
          { current_page: 2, total_pages: 2 },
        ),
      );

    const months = await fetchAnalyticsChart(RANGE, 'trip');

    expect(listTransactionByTagMock).toHaveBeenCalledTimes(2);
    expect(listTransactionByTagMock).toHaveBeenNthCalledWith(1, {
      path: { tag: 'trip' },
      query: {
        page: 1,
        limit: ANALYTICS_CHART_PAGE_LIMIT,
        start: START,
        end: END,
      },
    });
    expect(listTransactionMock).not.toHaveBeenCalled();
    expect(months[0]?.expenses).toEqual([{ amount: 12, fromCode: 'EUR' }]);
    expect(months[1]).toEqual({
      month: '2026-02-01',
      expenses: [],
      incomes: [],
    });
    expect(months[2]?.incomes).toEqual([{ amount: 40, fromCode: 'USD' }]);
  });
});
