import type { PAGE_SWIPE_DIRECTION } from '@/modules/budget/constants.ts';

export type PageSwipeDirection =
  (typeof PAGE_SWIPE_DIRECTION)[keyof typeof PAGE_SWIPE_DIRECTION];
