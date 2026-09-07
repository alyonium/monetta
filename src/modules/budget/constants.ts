import type { AccountBlockPagerLayout } from '@/modules/budget/types/accountBlockPagerLayout.ts';

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
export const ACCOUNTS_PAGE_LIMIT = 50;

export const BUDGET_ACCOUNTS_QUERY_KEY = ['budget', 'accounts'] as const;

export const ACCOUNT_PREFERENCES_MISSING_ERROR =
  'Account preferences are missing';
export const ACCOUNT_PREFERENCE_WRITE_ERROR =
  'Account preference could not be saved';
export const ACCOUNTS_MISSING_ERROR = 'Budget accounts are missing';

export const DEFAULT_ACCOUNT_ICON = 'Wallet';
export const DEFAULT_ACCOUNT_COLOR = '#4C6EF5';
export const ACCOUNT_ICON_SIZE = 24;

export const ACCOUNT_BLOCK_DESKTOP_MIN_PX = 961;
export const ACCOUNT_BLOCK_MOBILE_COLUMNS = 4;
export const ACCOUNT_CARD_MIN_WIDTH_PX = 80;
export const ACCOUNT_GRID_GAP_PX = 10;
export const ACCOUNT_GRID_ROW_GAP_PX = 0;
export const ACCOUNT_CARD_MIN_HEIGHT_DEFAULT = '6rem';
export const ACCOUNT_CARD_MIN_HEIGHT_DEFAULT_PX = 96;
export const ACCOUNT_CARD_MIN_HEIGHT_EXPENSE = '7.5rem';
export const ACCOUNT_CARD_MIN_HEIGHT_EXPENSE_PX = 120;

export const ACCOUNT_BLOCK_PAGER = {
  INCOME: {
    fillHeight: false,
    minHeight: ACCOUNT_CARD_MIN_HEIGHT_DEFAULT,
    minCardHeightPx: ACCOUNT_CARD_MIN_HEIGHT_DEFAULT_PX,
  },
  CURRENT: {
    fillHeight: false,
    minHeight: ACCOUNT_CARD_MIN_HEIGHT_DEFAULT,
    minCardHeightPx: ACCOUNT_CARD_MIN_HEIGHT_DEFAULT_PX,
  },
  EXPENSE: {
    fillHeight: true,
    minHeight: ACCOUNT_CARD_MIN_HEIGHT_EXPENSE,
    minCardHeightPx: ACCOUNT_CARD_MIN_HEIGHT_EXPENSE_PX,
  },
} as const satisfies Record<
  (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE],
  AccountBlockPagerLayout
>;

export const PAGE_SWIPE_DIRECTION = {
  NEXT: 'next',
  PREV: 'prev',
} as const;

export const PAGE_SWIPE_PX = 48;
export const PAGE_SWIPE_MS = 280;
export const PAGE_SWIPE_AXIS_LOCK_PX = 8;
export const PAGE_SWIPE_RUBBER_BAND = 0.35;
