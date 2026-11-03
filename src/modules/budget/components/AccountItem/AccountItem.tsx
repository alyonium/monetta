import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import { clsx } from 'clsx';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import AccountItemBody from './AccountItemBody/AccountItemBody.tsx';
import styles from './AccountItem.module.css';

type AccountItemProps = {
  account: BudgetAccount;
  overlay?: boolean;
  isOver?: boolean;
  isDragging?: boolean;
  cardRef?: (node: HTMLElement | null) => void;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onPointerDownCapture?: (event: ReactPointerEvent<HTMLDivElement>) => void;
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
  style?: CSSProperties;
};

const AccountItem = ({
  account,
  overlay = false,
  isOver = false,
  isDragging = false,
  cardRef,
  onClick,
  onKeyDown,
  onPointerDownCapture,
  listeners,
  attributes,
  style,
}: AccountItemProps) => (
  <div
    ref={cardRef}
    className={clsx(
      styles.card,
      isOver && styles.isOver,
      isDragging && styles.isDragging,
      overlay && styles.overlay,
    )}
    role={overlay ? undefined : 'button'}
    tabIndex={overlay ? undefined : 0}
    onClick={onClick}
    onKeyDown={onKeyDown}
    onPointerDownCapture={onPointerDownCapture}
    {...attributes}
    {...listeners}
    style={style}
  >
    <AccountItemBody account={account} />
  </div>
);

export default AccountItem;
