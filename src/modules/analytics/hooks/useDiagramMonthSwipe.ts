import { MouseEvent, PointerEvent, useRef } from 'react';
import { diagramPointerDirection } from '@/modules/analytics/helpers/diagramMonthSwipe.ts';
import { DiagramMonthSwipe } from '@/modules/analytics/types/analytics.ts';
import { PAGE_SWIPE_AXIS_LOCK_PX } from '@/modules/budget/constants/layout.ts';

type AxisLock = 'x' | 'y';

type UseDiagramMonthSwipeOptions = {
  enabled: boolean;
  onSwipe: (direction: DiagramMonthSwipe) => void;
};

export const useDiagramMonthSwipe = ({
  enabled,
  onSwipe,
}: UseDiagramMonthSwipeOptions) => {
  const start = useRef<{ x: number; y: number } | null>(null);
  const axis = useRef<AxisLock | null>(null);
  const didSwipe = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType !== 'touch') {
      return;
    }

    start.current = { x: event.clientX, y: event.clientY };
    axis.current = null;
    didSwipe.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const origin = start.current;

    if (!enabled || !origin) {
      return;
    }

    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;

    if (!axis.current) {
      if (
        Math.abs(dx) < PAGE_SWIPE_AXIS_LOCK_PX &&
        Math.abs(dy) < PAGE_SWIPE_AXIS_LOCK_PX
      ) {
        return;
      }

      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';

      if (axis.current === 'x') {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch (error) {
          void error;
        }
      }
    }

    if (axis.current !== 'x') {
      return;
    }

    didSwipe.current = true;
    event.preventDefault();
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const origin = start.current;
    const locked = axis.current;
    start.current = null;
    axis.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!enabled || !origin || locked !== 'x') {
      return;
    }

    const direction = diagramPointerDirection(
      event.clientX - origin.x,
      event.clientY - origin.y,
    );

    if (!direction) {
      return;
    }

    didSwipe.current = true;
    onSwipe(direction);
  };

  const onPointerCancel = () => {
    start.current = null;
    axis.current = null;
    didSwipe.current = false;
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!didSwipe.current) {
      return;
    }

    didSwipe.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    onClickCapture,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
};
