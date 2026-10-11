import { useState } from 'react';
import {
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { AccountPointerSensor } from '@/modules/budget/hooks/accountPointerSensor.ts';
import {
  budgetAccountFromDndData,
  resolveRecordDrop,
  type RecordDrop,
} from '@/modules/budget/helpers/transactions/resolveRecordDrop.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const useAccountDnd = (onDrop: (drop: RecordDrop) => void) => {
  const [activeAccount, setActiveAccount] = useState<BudgetAccount | null>(
    null,
  );
  const sensors = useSensors(useSensor(AccountPointerSensor));

  const onDragStart = (event: DragStartEvent) => {
    setActiveAccount(
      budgetAccountFromDndData(event.active.data.current) ?? null,
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveAccount(null);

    const drop = resolveRecordDrop(
      budgetAccountFromDndData(event.active.data.current),
      budgetAccountFromDndData(event.over?.data.current),
    );

    if (drop) {
      onDrop(drop);
    }
  };

  const onDragCancel = () => setActiveAccount(null);

  return { sensors, activeAccount, onDragStart, onDragEnd, onDragCancel };
};
