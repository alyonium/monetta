import { describe, expect, it } from 'vitest';
import { DIAGRAM_MONTH_SWIPE } from '@/modules/analytics/constants/analytics.ts';
import { diagramPointerDirection } from '@/modules/analytics/helpers/diagramMonthSwipe.ts';

describe('diagramPointerDirection', () => {
  it('treats a left drag as the previous month', () => {
    expect(diagramPointerDirection(-80, 4)).toBe(DIAGRAM_MONTH_SWIPE.PREVIOUS);
  });

  it('treats a right drag as the next month', () => {
    expect(diagramPointerDirection(80, 4)).toBe(DIAGRAM_MONTH_SWIPE.NEXT);
  });

  it('ignores a short or vertical drag', () => {
    expect(diagramPointerDirection(-20, 0)).toBeNull();
    expect(diagramPointerDirection(-80, 90)).toBeNull();
  });
});
