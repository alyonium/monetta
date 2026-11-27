import { DIAGRAM_MONTH_SWIPE } from '@/modules/analytics/constants/analytics.ts';
import { DiagramMonthSwipe } from '@/modules/analytics/types/analytics.ts';
import { PAGE_SWIPE_PX } from '@/modules/budget/constants/layout.ts';

export const diagramPointerDirection = (
  dx: number,
  dy: number,
): DiagramMonthSwipe | null => {
  if (Math.abs(dx) < PAGE_SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) {
    return null;
  }

  return dx < 0 ? DIAGRAM_MONTH_SWIPE.PREVIOUS : DIAGRAM_MONTH_SWIPE.NEXT;
};
