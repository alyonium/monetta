export const ACCOUNT_TYPE = {
  INCOME: 'INCOME',
  CURRENT: 'CURRENT',
  EXPENSE: 'EXPENSE',
} as const;

export const FIREFLY_ACCOUNT_TYPE = {
  REVENUE: 'revenue',
  ASSET: 'asset',
  EXPENSE: 'expense',
  LIABILITY: 'liability',
  LIABILITIES: 'liabilities',
} as const;

export const ACCOUNT_APPEARANCE_PREFIX = 'monetta.accountAppearance.';
export const ACCOUNT_ORDER_PREFIX = 'monetta.accountOrder.';
export const PREFERENCES_PAGE_LIMIT = 50;

export const ACCOUNT_PREFERENCES_MISSING_ERROR =
  'Account preferences are missing';
export const ACCOUNT_PREFERENCE_WRITE_ERROR =
  'Account preference could not be saved';
