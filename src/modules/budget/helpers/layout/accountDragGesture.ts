import {
  ACCOUNT_DRAG_GESTURE,
  PAGE_SWIPE_AXIS_LOCK_PX,
} from '@/modules/budget/constants/layout.ts';
import { isPageSwipeAxis } from '@/modules/budget/helpers/layout/pageSwipe.ts';
import type { AccountDragGesture } from '@/modules/budget/types/accountDragGesture.ts';

const dragDistanceReached = (dx: number, dy: number) =>
  Math.hypot(dx, dy) > PAGE_SWIPE_AXIS_LOCK_PX;

export const accountDragGesture = (
  dx: number,
  dy: number,
  held: boolean,
): AccountDragGesture => {
  if (held) {
    return ACCOUNT_DRAG_GESTURE.DRAG;
  }

  if (isPageSwipeAxis(dx, dy)) {
    return ACCOUNT_DRAG_GESTURE.SWIPE;
  }

  if (dragDistanceReached(dx, dy)) {
    return ACCOUNT_DRAG_GESTURE.DRAG;
  }

  return ACCOUNT_DRAG_GESTURE.WAIT;
};
