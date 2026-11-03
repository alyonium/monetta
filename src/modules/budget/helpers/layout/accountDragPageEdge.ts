import { PAGE_SWIPE_DIRECTION } from '@/modules/budget/constants/layout.ts';
import type { PageSwipeDirection } from '@/modules/budget/types/pageSwipeDirection.ts';

export const accountDragPageEdge = (
  point: { x: number; y: number },
  rect: { left: number; right: number; top: number; bottom: number },
  edgePx: number,
): PageSwipeDirection | null => {
  if (point.y < rect.top || point.y > rect.bottom) {
    return null;
  }

  if (point.x <= rect.left + edgePx) {
    return PAGE_SWIPE_DIRECTION.PREV;
  }

  if (point.x >= rect.right - edgePx) {
    return PAGE_SWIPE_DIRECTION.NEXT;
  }

  return null;
};
