import {
  type MouseEvent,
  type PointerEvent,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  PAGE_SWIPE_AXIS_LOCK_PX,
  PAGE_SWIPE_DIRECTION,
  PAGE_SWIPE_MS,
} from '@/modules/budget/constants.ts';
import type { PageSwipeDirection } from '@/modules/budget/types/pageSwipeDirection.ts';
import { resolvePageSwipe, rubberBandDragX } from './pageSwipe.ts';

const REST_TRANSFORM = 'translate3d(-100%, 0, 0)';
const NEXT_TRANSFORM = 'translate3d(-200%, 0, 0)';
const PREV_TRANSFORM = 'translate3d(0, 0, 0)';

type AxisLock = 'x' | 'y';

type UsePageSwipeOptions = {
  onNext: () => void;
  onPrev: () => void;
  canLoop: boolean;
  pageIndex: number;
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const usePageSwipe = ({
  onNext,
  onPrev,
  canLoop,
  pageIndex,
}: UsePageSwipeOptions) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const axisLock = useRef<AxisLock | null>(null);
  const didSwipe = useRef(false);
  const settling = useRef(false);
  const dragging = useRef(false);

  const setTrackTransform = (transform: string, animate: boolean) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.style.transition = animate
      ? `transform ${PAGE_SWIPE_MS}ms ease-out`
      : 'none';
    track.style.transform = transform;
  };

  useLayoutEffect(() => {
    if (dragging.current || settling.current) {
      return;
    }

    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.style.transition = 'none';
    track.style.transform = REST_TRANSFORM;
  }, [pageIndex]);

  const settleTo = (transform: string, onSettled?: () => void) => {
    const track = trackRef.current;

    if (!track || prefersReducedMotion()) {
      settling.current = false;
      setTrackTransform(REST_TRANSFORM, false);
      onSettled?.();
      return;
    }

    settling.current = true;
    let finished = false;

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      track.removeEventListener('transitionend', onEnd);
      window.clearTimeout(timeoutId);
      settling.current = false;
      onSettled?.();
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== 'transform') {
        return;
      }

      finish();
    };

    const timeoutId = window.setTimeout(finish, PAGE_SWIPE_MS + 80);

    track.addEventListener('transitionend', onEnd);
    setTrackTransform(transform, true);
  };

  const slideTo = (direction: PageSwipeDirection) => {
    if (settling.current || dragging.current || !canLoop) {
      return;
    }

    if (direction === PAGE_SWIPE_DIRECTION.NEXT) {
      settleTo(NEXT_TRANSFORM, onNext);
      return;
    }

    settleTo(PREV_TRANSFORM, onPrev);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      settling.current ||
      (event.pointerType === 'mouse' && event.button !== 0) ||
      (event.target instanceof Element && event.target.closest('button'))
    ) {
      return;
    }

    pointerStart.current = { x: event.clientX, y: event.clientY };
    axisLock.current = null;
    didSwipe.current = false;
    dragging.current = false;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is unavailable for some synthetic events.
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;

    if (!start || settling.current) {
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (!axisLock.current) {
      if (
        Math.abs(dx) < PAGE_SWIPE_AXIS_LOCK_PX &&
        Math.abs(dy) < PAGE_SWIPE_AXIS_LOCK_PX
      ) {
        return;
      }

      axisLock.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (axisLock.current !== 'x') {
      return;
    }

    event.preventDefault();
    dragging.current = true;
    didSwipe.current = true;
    setTrackTransform(
      `translate3d(calc(-100% + ${rubberBandDragX(dx, canLoop)}px), 0, 0)`,
      false,
    );
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    dragging.current = false;

    if (!start || settling.current) {
      return;
    }

    if (axisLock.current !== 'x') {
      axisLock.current = null;
      return;
    }

    axisLock.current = null;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const direction = resolvePageSwipe(dx, dy);

    if (direction === PAGE_SWIPE_DIRECTION.NEXT && canLoop) {
      settleTo(NEXT_TRANSFORM, onNext);
      return;
    }

    if (direction === PAGE_SWIPE_DIRECTION.PREV && canLoop) {
      settleTo(PREV_TRANSFORM, onPrev);
      return;
    }

    settleTo(REST_TRANSFORM);
  };

  const onPointerCancel = () => {
    pointerStart.current = null;
    axisLock.current = null;
    dragging.current = false;

    if (!settling.current) {
      settleTo(REST_TRANSFORM);
    }
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
    trackRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
    slideNext: () => slideTo(PAGE_SWIPE_DIRECTION.NEXT),
    slidePrev: () => slideTo(PAGE_SWIPE_DIRECTION.PREV),
  };
};
