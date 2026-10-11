import { describe, expect, it } from 'vitest';
import { ACCOUNT_DRAG_GESTURE } from '@/modules/budget/constants/layout.ts';
import { accountDragGesture } from '@/modules/budget/helpers/layout/accountDragGesture.ts';

describe('accountDragGesture', () => {
  it('pages on a sideways move before the card is held', () => {
    expect(accountDragGesture(-8, 2, false)).toBe(ACCOUNT_DRAG_GESTURE.SWIPE);
  });

  it('drags once the pointer has moved further down than the lock', () => {
    expect(accountDragGesture(0, 9, false)).toBe(ACCOUNT_DRAG_GESTURE.DRAG);
  });

  it('waits while the pointer is still inside the lock', () => {
    expect(accountDragGesture(0, 0, false)).toBe(ACCOUNT_DRAG_GESTURE.WAIT);
    expect(accountDragGesture(0, 8, false)).toBe(ACCOUNT_DRAG_GESTURE.WAIT);
  });

  it('drags after the hold, even with no movement or a sideways move', () => {
    expect(accountDragGesture(0, 0, true)).toBe(ACCOUNT_DRAG_GESTURE.DRAG);
    expect(accountDragGesture(20, 0, true)).toBe(ACCOUNT_DRAG_GESTURE.DRAG);
  });
});
