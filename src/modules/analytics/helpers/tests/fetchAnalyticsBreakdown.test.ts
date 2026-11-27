import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  insightExpenseExpense,
  insightIncomeRevenue,
  listTransactionByTag,
} from '@/api/sdk.gen.ts';
import { InsightGroupEntry } from '@/api/types.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import {
  ANALYTICS_BREAKDOWN_MISSING_ERROR,
  ANALYTICS_BREAKDOWN_PAGE_LIMIT,
} from '@/modules/analytics/constants/queries.ts';
import { fetchAnalyticsBreakdown } from '@/modules/analytics/helpers/fetchAnalyticsBreakdown.ts';
import {
  createFireflyTransaction,
  createTransactionPageResult,
  createTransactionSplit,
} from '@/modules/history/helpers/tests/testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  insightExpenseExpense: vi.fn(),
  insightIncomeRevenue: vi.fn(),
  listTransactionByTag: vi.fn(),
}));

const insightExpenseExpenseMock = vi.mocked(insightExpenseExpense);
const insightIncomeRevenueMock = vi.mocked(insightIncomeRevenue);
const listTransactionByTagMock = vi.mocked(listTransactionByTag);

const START = '2026-11-01';
const END = '2026-11-30';

const createInsightResult = (data: InsightGroupEntry[]) => ({
  data,
  error: undefined,
  request: createFireflyRequest('insight/expense/expense'),
  response: new Response(null, { status: 200 }),
});

describe('fetchAnalyticsBreakdown', () => {
  beforeEach(() => {
    insightExpenseExpenseMock.mockReset();
    insightIncomeRevenueMock.mockReset();
    listTransactionByTagMock.mockReset();
  });

  it('loads expense and income insight rows when no tag is selected', async () => {
    insightExpenseExpenseMock.mockResolvedValue(
      createInsightResult([
        { id: '9', name: 'Food', difference: '-4.50', currency_code: 'EUR' },
      ]),
    );
    insightIncomeRevenueMock.mockResolvedValue(
      createInsightResult([
        { id: '3', name: 'Job', difference: '10', currency_code: 'eur' },
      ]),
    );

    await expect(fetchAnalyticsBreakdown(START, END, null)).resolves.toEqual({
      expenses: [
        {
          id: '9',
          name: 'Food',
          amounts: [{ amount: 4.5, fromCode: 'EUR' }],
        },
      ],
      incomes: [
        { id: '3', name: 'Job', amounts: [{ amount: 10, fromCode: 'EUR' }] },
      ],
    });
    expect(insightExpenseExpenseMock).toHaveBeenCalledWith({
      query: { start: START, end: END },
    });
    expect(insightIncomeRevenueMock).toHaveBeenCalledWith({
      query: { start: START, end: END },
    });
    expect(listTransactionByTagMock).not.toHaveBeenCalled();
  });

  it('treats empty insight arrays as an empty breakdown', async () => {
    insightExpenseExpenseMock.mockResolvedValue(createInsightResult([]));
    insightIncomeRevenueMock.mockResolvedValue(createInsightResult([]));

    await expect(fetchAnalyticsBreakdown(START, END, null)).resolves.toEqual({
      expenses: [],
      incomes: [],
    });
  });

  it('throws when insight data is missing', async () => {
    insightExpenseExpenseMock.mockResolvedValue({
      data: undefined,
      error: { message: 'Unauthenticated' },
      request: createFireflyRequest('insight/expense/expense'),
      response: new Response(null, { status: 401 }),
    });
    insightIncomeRevenueMock.mockResolvedValue(createInsightResult([]));

    await expect(fetchAnalyticsBreakdown(START, END, null)).rejects.toEqual(
      new Error(ANALYTICS_BREAKDOWN_MISSING_ERROR),
    );
  });

  it('groups a tagged journal into expenses and incomes and ignores a transfer', async () => {
    listTransactionByTagMock.mockResolvedValue(
      createTransactionPageResult([
        createFireflyTransaction('10', [
          createTransactionSplit({
            transaction_journal_id: '101',
            type: 'withdrawal',
            destination_id: '8',
            destination_name: 'Cafe',
            amount: '12.00',
            currency_code: 'EUR',
            foreign_amount: '99.00',
            foreign_currency_code: 'USD',
          }),
          createTransactionSplit({
            transaction_journal_id: '102',
            type: 'deposit',
            source_id: '4',
            source_name: 'Job',
            amount: '40.00',
            currency_code: 'USD',
          }),
          createTransactionSplit({
            transaction_journal_id: '103',
            type: 'transfer',
            source_id: '1',
            source_name: 'Wallet',
            destination_id: '2',
            destination_name: 'Savings',
            amount: '15.00',
            currency_code: 'EUR',
          }),
          createTransactionSplit({
            transaction_journal_id: '104',
            type: 'reconciliation',
            amount: '3.00',
            currency_code: 'EUR',
          }),
          createTransactionSplit({
            transaction_journal_id: '105',
            type: 'opening balance',
            amount: '8.00',
            currency_code: 'EUR',
          }),
        ]),
      ]),
    );

    await expect(fetchAnalyticsBreakdown(START, END, 'trip')).resolves.toEqual({
      expenses: [
        {
          id: '8',
          name: 'Cafe',
          amounts: [{ amount: 12, fromCode: 'EUR' }],
        },
      ],
      incomes: [
        { id: '4', name: 'Job', amounts: [{ amount: 40, fromCode: 'USD' }] },
      ],
    });
    expect(listTransactionByTagMock).toHaveBeenCalledWith({
      path: { tag: 'trip' },
      query: {
        page: 1,
        limit: ANALYTICS_BREAKDOWN_PAGE_LIMIT,
        start: START,
        end: END,
      },
    });
    expect(insightExpenseExpenseMock).not.toHaveBeenCalled();
    expect(insightIncomeRevenueMock).not.toHaveBeenCalled();
  });

  it('reads every tagged page', async () => {
    listTransactionByTagMock
      .mockResolvedValueOnce(
        createTransactionPageResult(
          [
            createFireflyTransaction('10', [
              createTransactionSplit({
                transaction_journal_id: '101',
                type: 'withdrawal',
                destination_id: '8',
                destination_name: 'Cafe',
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
                source_id: '4',
                source_name: 'Job',
                amount: '40.00',
                currency_code: 'USD',
              }),
            ]),
          ],
          { current_page: 2, total_pages: 2 },
        ),
      );

    const breakdown = await fetchAnalyticsBreakdown(START, END, 'trip');

    expect(listTransactionByTagMock).toHaveBeenCalledTimes(2);
    expect(breakdown.expenses.map((account) => account.id)).toEqual(['8']);
    expect(breakdown.incomes.map((account) => account.id)).toEqual(['4']);
  });
});
