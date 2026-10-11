import type { ACCOUNT_DRAG_GESTURE } from '@/modules/budget/constants/layout.ts';

export type AccountDragGesture =
  (typeof ACCOUNT_DRAG_GESTURE)[keyof typeof ACCOUNT_DRAG_GESTURE];
