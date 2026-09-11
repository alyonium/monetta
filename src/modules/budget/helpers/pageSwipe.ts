import {
  PAGE_SWIPE_DIRECTION,
  PAGE_SWIPE_PX,
  PAGE_SWIPE_RUBBER_BAND,
} from '@/modules/budget/constants/layout.ts';
import type { PageSwipeDirection } from '@/modules/budget/types/pageSwipeDirection.ts';

export const resolvePageSwipe = (
  dx: number,
  dy: number,
  threshold = PAGE_SWIPE_PX,
): PageSwipeDirection | null => {
  if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) {
    return null;
  }

  return dx < 0 ? PAGE_SWIPE_DIRECTION.NEXT : PAGE_SWIPE_DIRECTION.PREV;
};

export const rubberBandDragX = (dx: number, canLoop: boolean): number => {
  if (!canLoop) {
    return dx * PAGE_SWIPE_RUBBER_BAND;
  }

  return dx;
};
