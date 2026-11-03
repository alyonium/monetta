import type { CSSProperties, KeyboardEvent } from 'react';
import { useAccountDndNode } from '@/modules/budget/hooks/useAccountDndNode.ts';
import { useClickAfterDrag } from '@/modules/budget/hooks/useClickAfterDrag.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import AccountItem from './AccountItem.tsx';

type InteractiveAccountItemProps = {
  account: BudgetAccount;
  onSelectAccount: (account: BudgetAccount) => void;
  editing?: boolean;
  style?: CSSProperties;
};

const InteractiveAccountItem = ({
  account,
  onSelectAccount,
  editing = false,
  style,
}: InteractiveAccountItemProps) => {
  const { setNodeRef, isDragging, isOver, listeners, attributes } =
    useAccountDndNode(account, editing);
  const { onClick, onPointerDownCapture } = useClickAfterDrag(isDragging, () =>
    onSelectAccount(account),
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onSelectAccount(account);
  };

  return (
    <AccountItem
      account={account}
      isOver={isOver}
      isDragging={isDragging}
      cardRef={setNodeRef}
      onClick={editing ? undefined : onClick}
      onKeyDown={editing ? undefined : onKeyDown}
      onPointerDownCapture={editing ? undefined : onPointerDownCapture}
      listeners={listeners}
      attributes={attributes}
      style={style}
    />
  );
};

export default InteractiveAccountItem;
