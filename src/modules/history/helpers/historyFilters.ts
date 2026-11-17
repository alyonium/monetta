import {
  endOfMonth,
  startOfMonth,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import {
  HISTORY_DATE_BOUND,
  HISTORY_FILTER_SCOPE,
  HISTORY_FILTER_TYPE,
} from '@/modules/history/constants/filters.ts';
import {
  HistoryDateBound,
  HistoryFilters,
  HistoryFilterScope,
  HistoryTransactionsQuery,
} from '@/modules/history/types/historyFilters.ts';

export const defaultHistoryFilters = (today: string): HistoryFilters => ({
  scope: HISTORY_FILTER_SCOPE.ALL,
  month: startOfMonth(today),
  start: startOfMonth(today),
  end: today,
  type: HISTORY_FILTER_TYPE.ALL,
  tag: null,
});

const historyFilterRange = (
  filters: HistoryFilters,
): { start: string; end: string } | null => {
  if (filters.scope === HISTORY_FILTER_SCOPE.MONTH) {
    return {
      start: startOfMonth(filters.month),
      end: endOfMonth(filters.month),
    };
  }

  if (filters.scope === HISTORY_FILTER_SCOPE.RANGE) {
    return { start: filters.start, end: filters.end };
  }

  return null;
};

export const toHistoryTransactionsQuery = (
  filters: HistoryFilters,
): HistoryTransactionsQuery => {
  const range = historyFilterRange(filters);
  const type =
    filters.type === HISTORY_FILTER_TYPE.ALL ? undefined : filters.type;

  return {
    ...(range === null ? {} : { start: range.start, end: range.end }),
    ...(type === undefined ? {} : { type }),
    tag: filters.tag,
  };
};

export const historyFilterCount = (filters: HistoryFilters): number =>
  Number(filters.scope !== HISTORY_FILTER_SCOPE.ALL) +
  Number(filters.type !== HISTORY_FILTER_TYPE.ALL) +
  Number(filters.tag !== null);

export const changeHistoryFilterScope = (
  filters: HistoryFilters,
  scope: HistoryFilterScope,
  today: string,
): HistoryFilters => {
  if (scope === HISTORY_FILTER_SCOPE.MONTH) {
    return {
      ...filters,
      scope,
      month: startOfMonth(today),
    };
  }

  if (scope === HISTORY_FILTER_SCOPE.RANGE) {
    return {
      ...filters,
      scope,
      start: startOfMonth(today),
      end: today,
    };
  }

  return { ...filters, scope };
};

export const clampHistoryDateRange = (
  range: Pick<HistoryFilters, 'start' | 'end'>,
  bound: HistoryDateBound,
  value: string,
): Pick<HistoryFilters, 'start' | 'end'> => {
  if (bound === HISTORY_DATE_BOUND.START) {
    return value > range.end
      ? { start: value, end: value }
      : { start: value, end: range.end };
  }

  return value < range.start
    ? { start: value, end: value }
    : { start: range.start, end: value };
};
