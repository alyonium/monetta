import { TransactionTypeFilter } from '@/api/types.gen.ts';
import {
  HISTORY_DATE_BOUND,
  HISTORY_FILTER_SCOPE,
  HISTORY_FILTER_TYPE,
} from '@/modules/history/constants/filters.ts';

export type HistoryFilterScope =
  (typeof HISTORY_FILTER_SCOPE)[keyof typeof HISTORY_FILTER_SCOPE];

export type HistoryFilterType =
  (typeof HISTORY_FILTER_TYPE)[keyof typeof HISTORY_FILTER_TYPE];

export type HistoryDateBound =
  (typeof HISTORY_DATE_BOUND)[keyof typeof HISTORY_DATE_BOUND];

export type HistoryFilters = {
  scope: HistoryFilterScope;
  month: string;
  start: string;
  end: string;
  type: HistoryFilterType;
  tag: string | null;
};

export type HistoryTransactionsQuery = {
  start?: string;
  end?: string;
  type?: TransactionTypeFilter;
  tag: string | null;
};
