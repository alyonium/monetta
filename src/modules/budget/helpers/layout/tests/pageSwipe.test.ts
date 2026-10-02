import { describe, expect, it } from 'vitest';
import { PAGE_SWIPE_DIRECTION } from '@/modules/budget/constants/layout.ts';
import {
  isPageSwipeAxis,
  resolvePageSwipe,
  rubberBandDragX,
} from '@/modules/budget/helpers/layout/pageSwipe.ts';

describe('resolvePageSwipe', () => {
  it('goes next when the finger moves left past the threshold', () => {
    expect(resolvePageSwipe(-48, 0)).toBe(PAGE_SWIPE_DIRECTION.NEXT);
    expect(resolvePageSwipe(-80, 10)).toBe(PAGE_SWIPE_DIRECTION.NEXT);
  });

  it('goes previous when the finger moves right past the threshold', () => {
    expect(resolvePageSwipe(48, 0)).toBe(PAGE_SWIPE_DIRECTION.PREV);
  });

  it('ignores a short or mostly vertical gesture', () => {
    expect(resolvePageSwipe(-47, 0)).toBeNull();
    expect(resolvePageSwipe(-80, 80)).toBeNull();
    expect(resolvePageSwipe(10, 80)).toBeNull();
  });
});

describe('isPageSwipeAxis', () => {
  it('treats a sideways move as paging and a downward move as a card drag', () => {
    expect(isPageSwipeAxis(-8, 2)).toBe(true);
    expect(isPageSwipeAxis(20, 6)).toBe(true);
    expect(isPageSwipeAxis(2, -20)).toBe(false);
    expect(isPageSwipeAxis(4, 4)).toBe(false);
  });
});

describe('rubberBandDragX', () => {
  it('passes through when the pager can loop', () => {
    expect(rubberBandDragX(-80, true)).toBe(-80);
    expect(rubberBandDragX(80, true)).toBe(80);
  });

  it('dampens a pull when there is only one page', () => {
    expect(rubberBandDragX(80, false)).toBe(28);
    expect(rubberBandDragX(-80, false)).toBe(-28);
  });
});
