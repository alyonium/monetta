import { PointerSensor, type PointerSensorProps } from '@dnd-kit/core';
import {
  ACCOUNT_DRAG_GESTURE,
  ACCOUNT_DRAG_HOLD_MS,
} from '@/modules/budget/constants/layout.ts';
import { accountDragGesture } from '@/modules/budget/helpers/layout/accountDragGesture.ts';

type PointerSensorInternals = {
  activated: boolean;
  initialCoordinates: { x: number; y: number } | null;
  handleStart: () => void;
  handleMove: (event: Event) => void;
  handleCancel: () => void;
};

const internals = (sensor: AccountPointerSensor): PointerSensorInternals =>
  sensor as unknown as PointerSensorInternals;

export class AccountPointerSensor extends PointerSensor {
  static {
    const parent = Object.getPrototypeOf(
      Object.getPrototypeOf(AccountPointerSensor.prototype),
    ) as PointerSensorInternals;

    const prototype = AccountPointerSensor.prototype as unknown as {
      handleMove: (this: AccountPointerSensor, event: Event) => void;
    };

    prototype.handleMove = function handleMove(event: Event) {
      AccountPointerSensor.#handleMove(parent, this, event);
    };
  }

  static #handleMove(
    parent: PointerSensorInternals,
    sensor: AccountPointerSensor,
    event: Event,
  ) {
    const state = internals(sensor);

    if (state.activated) {
      parent.handleMove.call(sensor, event);
      return;
    }

    if (!(event instanceof PointerEvent) || !state.initialCoordinates) {
      return;
    }

    sensor.#follow(
      event.clientX - state.initialCoordinates.x,
      event.clientY - state.initialCoordinates.y,
    );
  }

  #holdTimer: ReturnType<typeof setTimeout> | null = null;
  #held = false;
  #removePointerEnd: (() => void) | null = null;

  constructor(props: PointerSensorProps) {
    super({
      ...props,
      options: {
        ...props.options,
        activationConstraint: { distance: Number.POSITIVE_INFINITY },
      },
    });

    const target = props.event.target;
    const doc =
      target instanceof Node ? (target.ownerDocument ?? document) : document;
    const pointerId =
      props.event instanceof PointerEvent ? props.event.pointerId : null;

    const finish = (event: Event) => {
      if (
        pointerId !== null &&
        event instanceof PointerEvent &&
        event.pointerId !== pointerId
      ) {
        return;
      }

      this.#endHold();
    };

    doc.addEventListener('pointerup', finish);
    doc.addEventListener('pointercancel', finish);

    this.#removePointerEnd = () => {
      doc.removeEventListener('pointerup', finish);
      doc.removeEventListener('pointercancel', finish);
    };

    this.#holdTimer = setTimeout(() => {
      this.#holdTimer = null;
      this.#held = true;
      this.#follow(0, 0);
    }, ACCOUNT_DRAG_HOLD_MS);
  }

  #endHold() {
    this.#removePointerEnd?.();
    this.#removePointerEnd = null;

    if (this.#holdTimer == null) {
      return;
    }

    clearTimeout(this.#holdTimer);
    this.#holdTimer = null;
  }

  #follow(dx: number, dy: number) {
    const sensor = internals(this);

    if (sensor.activated) {
      return;
    }

    const gesture = accountDragGesture(dx, dy, this.#held);

    switch (gesture) {
      case ACCOUNT_DRAG_GESTURE.WAIT:
        return;
      case ACCOUNT_DRAG_GESTURE.SWIPE:
        this.#endHold();
        sensor.handleCancel();
        return;
      case ACCOUNT_DRAG_GESTURE.DRAG:
        sensor.handleStart();
        return;
      default:
        return gesture satisfies never;
    }
  }
}
