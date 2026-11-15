import { beforeEach, describe, expect, it, vi } from 'vitest';
import { insightExpenseTotal, insightIncomeTotal } from '@/api/sdk.gen.ts';
import { InsightTotalEntry } from '@/api/types.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import { BUDGET_INSIGHTS_MISSING_ERROR } from '@/modules/budget/constants/queries.ts';
import { fetchBudgetInsights } from '@/modules/budget/helpers/month/fetchBudgetInsights.ts';

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
  request: createFireflyRequest('insight/income/total'),
  response: new Response(null, { status: 200 }),
});

const createMissingInsightResult = () => ({
  data: undefined,
  error: { message: 'Unauthenticated' },
  request: createFireflyRequest('insight/income/total'),
  response: new Response(null, { status: 401 }),
});

describe('fetchBudgetInsights', () => {
  beforeEach(() => {
    insightIncomeTotalMock.mockReset();
    insightExpenseTotalMock.mockReset();
  });

  it('loads income and expense totals for the range', async () => {
    insightIncomeTotalMock.mockResolvedValue(
      createInsightResult([
        { difference: '10.00', currency_code: 'EUR' },
        { difference: '-3.00', currency_code: 'USD' },
      ]),
    );
    insightExpenseTotalMock.mockResolvedValue(
      createInsightResult([{ difference: '-4.50', currency_code: 'EUR' }]),
    );

    expect(await fetchBudgetInsights(START, END)).toEqual({
      income: [
        { amount: 10, fromCode: 'EUR' },
        { amount: 3, fromCode: 'USD' },
      ],
      expenses: [{ amount: 4.5, fromCode: 'EUR' }],
    });

    expect(insightIncomeTotalMock).toHaveBeenCalledWith({
      query: { start: START, end: END },
    });
    expect(insightExpenseTotalMock).toHaveBeenCalledWith({
      query: { start: START, end: END },
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
