import { type RefObject, useEffect, useRef } from 'react';
import {
  ACCOUNT_PAGE_EDGE_HOLD_MS,
  ACCOUNT_PAGE_EDGE_PX,
  PAGE_SWIPE_DIRECTION,
} from '@/modules/budget/constants/layout.ts';
import { accountDragPageEdge } from '@/modules/budget/helpers/layout/accountDragPageEdge.ts';
import type { PageSwipeDirection } from '@/modules/budget/types/pageSwipeDirection.ts';

type UseAccountDragPageEdgeArgs = {
  enabled: boolean;
  boundaryRef: RefObject<HTMLElement | null>;
  onPrev: () => void;
  onNext: () => void;
};

const turnPage = (
  edge: PageSwipeDirection,
  onPrev: () => void,
  onNext: () => void,
) => {
  switch (edge) {
    case PAGE_SWIPE_DIRECTION.PREV:
      onPrev();
      return;
    case PAGE_SWIPE_DIRECTION.NEXT:
      onNext();
      return;
  }
};

export const useAccountDragPageEdge = ({
  enabled,
  boundaryRef,
  onPrev,
  onNext,
}: UseAccountDragPageEdgeArgs) => {
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);

  useEffect(() => {
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let armedEdge: PageSwipeDirection | null = null;
    let point: { x: number; y: number } | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const stopTimer = () => {
      if (timer === null) {
        return;
      }

      clearTimeout(timer);
      timer = null;
    };

    const edgeAt = (latest: { x: number; y: number }) => {
      const boundary = boundaryRef.current;

      if (!boundary) {
        return null;
      }

      return accountDragPageEdge(
        latest,
        boundary.getBoundingClientRect(),
        ACCOUNT_PAGE_EDGE_PX,
      );
    };

    const arm = (edge: PageSwipeDirection) => {
      stopTimer();
      armedEdge = edge;
      timer = setTimeout(() => {
        timer = null;
        const current = point ? edgeAt(point) : null;

        if (current !== edge) {
          armedEdge = null;
          return;
        }

        turnPage(current, onPrevRef.current, onNextRef.current);
        arm(current);
      }, ACCOUNT_PAGE_EDGE_HOLD_MS);
    };

    const onPointerMove = (event: PointerEvent) => {
      const nextPoint = { x: event.clientX, y: event.clientY };
      point = nextPoint;
      const edge = edgeAt(nextPoint);

      if (edge === armedEdge) {
        return;
      }

      stopTimer();
      armedEdge = null;

      if (edge !== null) {
        arm(edge);
      }
    };

    document.addEventListener('pointermove', onPointerMove);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      stopTimer();
    };
  }, [boundaryRef, enabled]);
};
