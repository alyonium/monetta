export const ACCOUNT_TRANSACTION_FLOW = {
  IN: 'in',
  OUT: 'out',
} as const;

export const FIREFLY_TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
} as const;

export type FireflyTransactionType =
  (typeof FIREFLY_TRANSACTION_TYPE)[keyof typeof FIREFLY_TRANSACTION_TYPE];

export const ACCOUNT_TRANSACTIONS_STATUS = {
  LOADING: 'loading',
  ERROR: 'error',
  EMPTY: 'empty',
  READY: 'ready',
} as const;
