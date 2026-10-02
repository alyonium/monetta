import { PointerSensor } from '@dnd-kit/core';
import { isPageSwipeAxis } from '@/modules/budget/helpers/layout/pageSwipe.ts';

type PointerSensorState = {
  activated: boolean;
  initialCoordinates: { x: number; y: number } | null;
  handleCancel: () => void;
  handleMove: (event: Event) => void;
};

const sensorState = (sensor: AccountPointerSensor): PointerSensorState =>
  sensor as unknown as PointerSensorState;

export class AccountPointerSensor extends PointerSensor {}

const parentMove = (
  Object.getPrototypeOf(
    Object.getPrototypeOf(AccountPointerSensor.prototype),
  ) as PointerSensorState
).handleMove;

const prototype =
  AccountPointerSensor.prototype as unknown as PointerSensorState;

prototype.handleMove = function handleMove(
  this: AccountPointerSensor,
  event: Event,
) {
  const sensor = sensorState(this);

  if (
    !sensor.activated &&
    sensor.initialCoordinates &&
    event instanceof PointerEvent &&
    isPageSwipeAxis(
      event.clientX - sensor.initialCoordinates.x,
      event.clientY - sensor.initialCoordinates.y,
    )
  ) {
    sensor.handleCancel();
    return;
  }

  parentMove.call(this, event);
};
