import { beforeEach, describe, expect, it, vi } from 'vitest';
import { insightExpenseTotal, insightIncomeTotal } from '@/api/sdk.gen.ts';
import type { InsightTotalEntry } from '@/api/types.gen.ts';
import { BUDGET_INSIGHTS_MISSING_ERROR } from '@/modules/budget/constants.ts';
import { fetchBudgetInsights } from '@/modules/budget/helpers/fetchBudgetInsights.ts';
import { createRequest } from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  insightIncomeTotal: vi.fn(),
  insightExpenseTotal: vi.fn(),
}));

const insightIncomeTotalMock = vi.mocked(insightIncomeTotal);
const insightExpenseTotalMock = vi.mocked(insightExpenseTotal);

const START = '2026-09-01';
const END = '2026-09-07';

const createInsightResult = (data: InsightTotalEntry[]) => ({
  data,
  error: undefined,
  request: createRequest('insight/income/total'),
  response: new Response(null, { status: 200 }),
});

const createMissingInsightResult = () => ({
  data: undefined,
  error: { message: 'Unauthenticated' },
  request: createRequest('insight/income/total'),
  response: new Response(null, { status: 401 }),
});

describe('fetchBudgetInsights', () => {
  beforeEach(() => {
    insightIncomeTotalMock.mockReset();
    insightExpenseTotalMock.mockReset();
  });

  it('loads income and expense totals for the range', async () => {
    insightIncomeTotalMock.mockResolvedValue(
      createInsightResult([{ difference: '10.00', currency_code: 'EUR' }]),
    );
    insightExpenseTotalMock.mockResolvedValue(
      createInsightResult([{ difference: '-4.50', currency_code: 'EUR' }]),
    );

    expect(await fetchBudgetInsights(START, END)).toEqual({
      income: [{ amount: 10, fromCode: 'EUR' }],
      expenses: [{ amount: 4.5, fromCode: 'EUR' }],
    });

    expect(insightIncomeTotalMock).toHaveBeenCalledWith({
      query: { start: START, end: END },
    });
    expect(insightExpenseTotalMock).toHaveBeenCalledWith({
      query: { start: START, end: END },
    });
  });

  it('maps insight rows to amounts and drops invalid entries', async () => {
    insightIncomeTotalMock.mockResolvedValue(
      createInsightResult([
        { difference: '-10.00', currency_code: 'USD' },
        { difference: 'nope', currency_code: 'EUR' },
        { difference: '1', currency_code: '' },
      ]),
    );
    insightExpenseTotalMock.mockResolvedValue(
      createInsightResult([{ difference: '4.50', currency_code: 'EUR' }]),
    );

    expect(await fetchBudgetInsights(START, END)).toEqual({
      income: [{ amount: 10, fromCode: 'USD' }],
      expenses: [{ amount: 4.5, fromCode: 'EUR' }],
    });
  });

  it('treats empty insight arrays as valid zeros', async () => {
    insightIncomeTotalMock.mockResolvedValue(createInsightResult([]));
    insightExpenseTotalMock.mockResolvedValue(createInsightResult([]));

    expect(await fetchBudgetInsights(START, END)).toEqual({
      income: [],
      expenses: [],
    });
  });

  it('throws when insight data is missing', async () => {
    insightIncomeTotalMock.mockResolvedValue(createMissingInsightResult());
    insightExpenseTotalMock.mockResolvedValue(createInsightResult([]));

    let missingDataError: Error | undefined;

    try {
      await fetchBudgetInsights(START, END);
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(BUDGET_INSIGHTS_MISSING_ERROR));
  });
});
