import { describe, expect, it } from 'vitest';
import { PAGE_SWIPE_DIRECTION } from '@/modules/budget/constants/layout.ts';
import { accountDragPageEdge } from '@/modules/budget/helpers/layout/accountDragPageEdge.ts';

const rect = { left: 100, right: 300, top: 40, bottom: 160 };

describe('accountDragPageEdge', () => {
  it('uses the left side, including past the block, as the previous page', () => {
    expect(accountDragPageEdge({ x: 80, y: 80 }, rect, 28)).toBe(
      PAGE_SWIPE_DIRECTION.PREV,
    );
    expect(accountDragPageEdge({ x: 120, y: 80 }, rect, 28)).toBe(
      PAGE_SWIPE_DIRECTION.PREV,
    );
  });

  it('uses the right side, including past the block, as the next page', () => {
    expect(accountDragPageEdge({ x: 280, y: 80 }, rect, 28)).toBe(
      PAGE_SWIPE_DIRECTION.NEXT,
    );
    expect(accountDragPageEdge({ x: 340, y: 80 }, rect, 28)).toBe(
      PAGE_SWIPE_DIRECTION.NEXT,
    );
  });

  it('ignores the middle of the block and a point outside its height', () => {
    expect(accountDragPageEdge({ x: 200, y: 80 }, rect, 28)).toBeNull();
    expect(accountDragPageEdge({ x: 340, y: 200 }, rect, 28)).toBeNull();
  });
});
