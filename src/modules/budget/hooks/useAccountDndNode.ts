import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ACCOUNT_DND } from '@/modules/budget/constants/accountDnd.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const useAccountDndNode = (account: BudgetAccount) => {
  const { draggable, droppable } = ACCOUNT_DND[account.type];
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: account.id,
    data: { account },
    disabled: !draggable,
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: account.id,
    data: { account },
    disabled: !droppable,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  return {
    setNodeRef,
    isDragging,
    isOver,
    listeners: draggable ? listeners : undefined,
    attributes: draggable ? attributes : undefined,
  };
};
