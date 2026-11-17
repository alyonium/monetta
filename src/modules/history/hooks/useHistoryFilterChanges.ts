import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import {
  HISTORY_DATE_BOUND,
  HISTORY_FILTER_SCOPE,
  HISTORY_FILTER_TYPE,
} from '@/modules/history/constants/filters.ts';
import {
  changeHistoryFilterScope,
  clampHistoryDateRange,
} from '@/modules/history/helpers/historyFilters.ts';
import { HistoryFilters } from '@/modules/history/types/historyFilters.ts';

export const useHistoryFilterChanges = (
  filters: HistoryFilters,
  onChange: (filters: HistoryFilters) => void,
) => {
  const onScopeChange = (value: string | null) => {
    if (
      value !== HISTORY_FILTER_SCOPE.ALL &&
      value !== HISTORY_FILTER_SCOPE.MONTH &&
      value !== HISTORY_FILTER_SCOPE.RANGE
    ) {
      return;
    }

    onChange(changeHistoryFilterScope(filters, value, todayIso()));
  };

  const onTypeChange = (value: string | null) => {
    if (
      value !== HISTORY_FILTER_TYPE.ALL &&
      value !== HISTORY_FILTER_TYPE.DEPOSIT &&
      value !== HISTORY_FILTER_TYPE.WITHDRAWAL &&
      value !== HISTORY_FILTER_TYPE.TRANSFER &&
      value !== HISTORY_FILTER_TYPE.RECONCILIATION &&
      value !== HISTORY_FILTER_TYPE.OPENING_BALANCE
    ) {
      return;
    }

    onChange({ ...filters, type: value });
  };

  const onMonthChange = (value: string | null) => {
    if (value === null) {
      return;
    }

    onChange({ ...filters, month: startOfMonth(value) });
  };

  const onStartChange = (value: string | null) => {
    if (value === null) {
      return;
    }

    onChange({
      ...filters,
      ...clampHistoryDateRange(filters, HISTORY_DATE_BOUND.START, value),
    });
  };

  const onEndChange = (value: string | null) => {
    if (value === null) {
      return;
    }

    onChange({
      ...filters,
      ...clampHistoryDateRange(filters, HISTORY_DATE_BOUND.END, value),
    });
  };

  return {
    onEndChange,
    onMonthChange,
    onScopeChange,
    onStartChange,
    onTypeChange,
  };
};
