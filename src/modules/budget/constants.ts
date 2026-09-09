import { DEFAULT_THEME } from '@mantine/core';
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

export const FIREFLY_ACCOUNT_ROLE = {
  DEFAULT_ASSET: 'defaultAsset',
} as const;

export const FIREFLY_LIABILITY_TYPE = {
  DEBT: 'debt',
} as const;

export const FIREFLY_LIABILITY_DIRECTION = {
  DEBIT: 'debit',
} as const;

export const FIREFLY_LIABILITY_INTEREST = '0';

export const FIREFLY_LIABILITY_INTEREST_PERIOD = {
  MONTHLY: 'monthly',
} as const;

export const CREATE_ACCOUNT_TITLE_KEY = {
  INCOME: 'budget.createAccount.title.income',
  CURRENT: 'budget.createAccount.title.current',
  EXPENSE: 'budget.createAccount.title.expense',
} as const satisfies Record<
  (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE],
  | 'budget.createAccount.title.income'
  | 'budget.createAccount.title.current'
  | 'budget.createAccount.title.expense'
>;

export const EXPENSE_KIND = {
  EXPENSE: 'expense',
  DEBT: 'debt',
} as const;

export const EXPENSE_KIND_DATA = [
  {
    value: EXPENSE_KIND.EXPENSE,
    label: 'budget.createAccount.expense',
  },
  {
    value: EXPENSE_KIND.DEBT,
    label: 'budget.createAccount.debt',
  },
] as const;

export const ACCOUNT_APPEARANCE_PREFIX = 'monetta.accountAppearance.';
export const ACCOUNT_ORDER_PREFIX = 'monetta.accountOrder.';
export const PREFERENCES_PAGE_LIMIT = 50;
export const ACCOUNTS_PAGE_LIMIT = 50;

export const BUDGET_ACCOUNTS_QUERY_KEY = ['budget', 'accounts'] as const;
export const BUDGET_INSIGHTS_QUERY_KEY = ['budget', 'insights', 'v2'] as const;

export const ACCOUNT_PREFERENCES_MISSING_ERROR =
  'Account preferences are missing';
export const ACCOUNT_PREFERENCE_WRITE_ERROR =
  'Account preference could not be saved';
export const ACCOUNTS_MISSING_ERROR = 'Budget accounts are missing';
export const BUDGET_INSIGHTS_MISSING_ERROR = 'Budget insights are missing';

export const CREATE_BUDGET_ACCOUNT_FAILURE_REASON = {
  NAME: 'name',
  FAILED: 'failed',
} as const;

export const DEFAULT_ACCOUNT_ICON = 'Wallet';
export const DEFAULT_ACCOUNT_COLOR = '#4C6EF5';
export const ACCOUNT_ICON_SIZE = 24;

const FILLED_SHADE = 6;
const ACCOUNT_FILL_WHITE = '#FFFFFF';
const ACCOUNT_FILL_BLACK = '#000000';
const ACCOUNT_FILL_LIME = DEFAULT_THEME.colors.lime[FILLED_SHADE];
const ACCOUNT_FILL_YELLOW = DEFAULT_THEME.colors.yellow[FILLED_SHADE];

export const ACCOUNT_COLORS = [
  ACCOUNT_FILL_WHITE,
  ACCOUNT_FILL_BLACK,
  DEFAULT_THEME.colors.red[FILLED_SHADE],
  DEFAULT_THEME.colors.pink[FILLED_SHADE],
  DEFAULT_THEME.colors.grape[FILLED_SHADE],
  DEFAULT_THEME.colors.violet[FILLED_SHADE],
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_THEME.colors.blue[FILLED_SHADE],
  DEFAULT_THEME.colors.cyan[FILLED_SHADE],
  DEFAULT_THEME.colors.teal[FILLED_SHADE],
  DEFAULT_THEME.colors.green[FILLED_SHADE],
  ACCOUNT_FILL_LIME,
  ACCOUNT_FILL_YELLOW,
  DEFAULT_THEME.colors.orange[FILLED_SHADE],
] as const;

export const ACCOUNT_DARK_INK_FILLS = [
  ACCOUNT_FILL_WHITE,
  ACCOUNT_FILL_LIME,
  ACCOUNT_FILL_YELLOW,
] as const;

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
