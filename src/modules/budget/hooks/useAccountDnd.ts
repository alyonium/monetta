import { useState } from 'react';
import {
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import { persistBlockOrder } from '@/modules/budget/helpers/account/persistBlockOrder.ts';
import { reorderBlock } from '@/modules/budget/helpers/account/reorderBlock.ts';
import {
  budgetAccountFromDndData,
  resolveRecordDrop,
} from '@/modules/budget/helpers/transactions/resolveRecordDrop.ts';
import { AccountPointerSensor } from '@/modules/budget/hooks/accountPointerSensor.ts';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';
import type { UseAccountDndArgs } from '@/modules/budget/types/useAccountDndArgs.ts';

const sameBlockPointerWithin =
  (activeType: AccountType | undefined): CollisionDetection =>
  (args) => {
    const type =
      activeType ?? budgetAccountFromDndData(args.active.data.current)?.type;

    if (!type) {
      return pointerWithin(args);
    }

    return pointerWithin({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (container) =>
          budgetAccountFromDndData(container.data.current)?.type === type,
      ),
    });
  };

export const useAccountDnd = ({
  editing,
  month,
  accounts,
  onDrop,
}: UseAccountDndArgs) => {
  const queryClient = useQueryClient();
  const [activeAccount, setActiveAccount] = useState<BudgetAccount | null>(
    null,
  );
  const [overAccount, setOverAccount] = useState<BudgetAccount | null>(null);
  const sensors = useSensors(useSensor(AccountPointerSensor));

  const onDragStart = (event: DragStartEvent) => {
    setActiveAccount(
      budgetAccountFromDndData(event.active.data.current) ?? null,
    );
    setOverAccount(null);
  };

  const onDragOver = (event: DragOverEvent) => {
    if (!editing || !activeAccount) {
      return;
    }

    const next = budgetAccountFromDndData(event.over?.data.current);

    if (
      !next ||
      next.id === activeAccount.id ||
      next.type !== activeAccount.type ||
      next.id === overAccount?.id
    ) {
      return;
    }

    setOverAccount(next);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const active = editing
      ? activeAccount
      : budgetAccountFromDndData(event.active.data.current);
    const over = editing
      ? overAccount
      : budgetAccountFromDndData(event.over?.data.current);
    setActiveAccount(null);
    setOverAccount(null);

    if (editing) {
      if (!active || !over || !accounts) {
        return;
      }

      const next = reorderBlock(accounts[active.type], active, over);

      if (!next) {
        return;
      }

      void persistBlockOrder(queryClient, month, active.type, next);
      return;
    }

    const drop = resolveRecordDrop(active, over);

    if (drop) {
      onDrop(drop);
    }
  };

  const onDragCancel = () => {
    setActiveAccount(null);
    setOverAccount(null);
  };

  return {
    sensors,
    collisionDetection: editing
      ? sameBlockPointerWithin(activeAccount?.type)
      : undefined,
    activeAccount,
    overAccount,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
};
