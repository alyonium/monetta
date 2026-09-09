import { describe, expect, it } from 'vitest';
import { PAGE_SWIPE_DIRECTION } from '@/modules/budget/constants.ts';
import { resolvePageSwipe, rubberBandDragX } from '@/modules/budget/helpers/pageSwipe.ts';

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
