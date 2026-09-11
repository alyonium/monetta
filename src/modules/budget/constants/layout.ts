import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import type { AccountBlockPagerLayout } from '@/modules/budget/types/accountBlockPagerLayout.ts';

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
