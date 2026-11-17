export const HISTORY_FILTER_SCOPE = {
  ALL: 'all',
  MONTH: 'month',
  RANGE: 'range',
} as const;

export const HISTORY_FILTER_TYPE = {
  ALL: 'all',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
  RECONCILIATION: 'reconciliation',
  OPENING_BALANCE: 'opening_balance',
} as const;

export const HISTORY_DATE_BOUND = {
  START: 'start',
  END: 'end',
} as const;
