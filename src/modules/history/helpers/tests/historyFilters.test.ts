import { describe, expect, it } from 'vitest';
import {
  HISTORY_DATE_BOUND,
  HISTORY_FILTER_SCOPE,
  HISTORY_FILTER_TYPE,
} from '@/modules/history/constants/filters.ts';
import {
  changeHistoryFilterScope,
  clampHistoryDateRange,
  defaultHistoryFilters,
  historyFilterCount,
  toHistoryTransactionsQuery,
} from '@/modules/history/helpers/historyFilters.ts';
import { HistoryFilters } from '@/modules/history/types/historyFilters.ts';

const TODAY = '2026-11-17';

const withFilters = (extra: Partial<HistoryFilters> = {}): HistoryFilters => ({
  ...defaultHistoryFilters(TODAY),
  ...extra,
});

describe('toHistoryTransactionsQuery', () => {
  it('omits start, end, and type for the default filters', () => {
    expect(toHistoryTransactionsQuery(defaultHistoryFilters(TODAY))).toEqual({
      tag: null,
    });
  });

  it('uses the full calendar month, including days after today', () => {
    const currentMonth = changeHistoryFilterScope(
      defaultHistoryFilters(TODAY),
      HISTORY_FILTER_SCOPE.MONTH,
      TODAY,
    );
    const pastMonth = withFilters({
      scope: HISTORY_FILTER_SCOPE.MONTH,
      month: '2026-08-15',
    });

    expect(toHistoryTransactionsQuery(currentMonth)).toEqual({
      start: '2026-11-01',
      end: '2026-11-30',
      tag: null,
    });
    expect(toHistoryTransactionsQuery(pastMonth)).toEqual({
      start: '2026-08-01',
      end: '2026-08-31',
      tag: null,
    });
  });

  it('uses the selected start and end for a date range', () => {
    expect(
      toHistoryTransactionsQuery(
        withFilters({
          scope: HISTORY_FILTER_SCOPE.RANGE,
          start: '2026-01-02',
          end: '2026-03-04',
        }),
      ),
    ).toEqual({
      start: '2026-01-02',
      end: '2026-03-04',
      tag: null,
    });
  });

  it('sends a transaction type and leaves all types off the query', () => {
    expect(
      toHistoryTransactionsQuery(
        withFilters({ type: HISTORY_FILTER_TYPE.WITHDRAWAL }),
      ),
    ).toEqual({
      type: 'withdrawal',
      tag: null,
    });
    expect(
      toHistoryTransactionsQuery(
        withFilters({
          scope: HISTORY_FILTER_SCOPE.MONTH,
          month: '2026-11-01',
          type: HISTORY_FILTER_TYPE.ALL,
        }),
      ),
    ).toEqual({
      start: '2026-11-01',
      end: '2026-11-30',
      tag: null,
    });
  });

  it('keeps one tag without adding a period', () => {
    expect(
      toHistoryTransactionsQuery(withFilters({ tag: 'Groceries' })),
    ).toEqual({
      tag: 'Groceries',
    });
  });
});

describe('historyFilterCount', () => {
  it('counts scope, type, and tag and ignores the month and dates inside a scope', () => {
    const month = withFilters({
      scope: HISTORY_FILTER_SCOPE.MONTH,
      month: '2020-01-01',
    });

    expect(historyFilterCount(defaultHistoryFilters(TODAY))).toBe(0);
    expect(historyFilterCount(month)).toBe(1);
    expect(
      historyFilterCount(
        withFilters({
          scope: HISTORY_FILTER_SCOPE.RANGE,
          type: HISTORY_FILTER_TYPE.DEPOSIT,
        }),
      ),
    ).toBe(2);
    expect(
      historyFilterCount(
        withFilters({
          scope: HISTORY_FILTER_SCOPE.MONTH,
          type: HISTORY_FILTER_TYPE.TRANSFER,
          tag: 'Rent',
        }),
      ),
    ).toBe(3);
  });
});

describe('changeHistoryFilterScope', () => {
  it('sets the current month and the current month through today', () => {
    const month = changeHistoryFilterScope(
      defaultHistoryFilters(TODAY),
      HISTORY_FILTER_SCOPE.MONTH,
      TODAY,
    );
    const range = changeHistoryFilterScope(
      withFilters({ type: HISTORY_FILTER_TYPE.DEPOSIT, tag: 'Rent' }),
      HISTORY_FILTER_SCOPE.RANGE,
      TODAY,
    );

    expect(month.scope).toBe(HISTORY_FILTER_SCOPE.MONTH);
    expect(month.month).toBe('2026-11-01');
    expect(range).toMatchObject({
      scope: HISTORY_FILTER_SCOPE.RANGE,
      start: '2026-11-01',
      end: TODAY,
      type: HISTORY_FILTER_TYPE.DEPOSIT,
      tag: 'Rent',
    });
  });
});

describe('clampHistoryDateRange', () => {
  const range = { start: '2026-01-01', end: '2026-01-10' };

  it('moves the other bound to the one that was just changed', () => {
    expect(
      clampHistoryDateRange(range, HISTORY_DATE_BOUND.START, '2026-01-20'),
    ).toEqual({ start: '2026-01-20', end: '2026-01-20' });
    expect(
      clampHistoryDateRange(range, HISTORY_DATE_BOUND.END, '2025-12-01'),
    ).toEqual({ start: '2025-12-01', end: '2025-12-01' });
  });

  it('keeps the other bound when the range stays in order', () => {
    expect(
      clampHistoryDateRange(range, HISTORY_DATE_BOUND.START, '2026-01-05'),
    ).toEqual({ start: '2026-01-05', end: '2026-01-10' });
    expect(
      clampHistoryDateRange(range, HISTORY_DATE_BOUND.END, '2026-01-15'),
    ).toEqual({ start: '2026-01-01', end: '2026-01-15' });
  });
});
