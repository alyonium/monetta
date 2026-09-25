import type { KeyboardEvent } from 'react';
import { useAccountDndNode } from '@/modules/budget/hooks/useAccountDndNode.ts';
import { useClickAfterDrag } from '@/modules/budget/hooks/useClickAfterDrag.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import AccountItem from './AccountItem.tsx';

type InteractiveAccountItemProps = {
  account: BudgetAccount;
  onSelectAccount: (account: BudgetAccount) => void;
};

const InteractiveAccountItem = ({
  account,
  onSelectAccount,
}: InteractiveAccountItemProps) => {
  const { setNodeRef, isDragging, isOver, listeners, attributes } =
    useAccountDndNode(account);
  const { onClick, onPointerDownCapture } = useClickAfterDrag(
    isDragging,
    () => onSelectAccount(account),
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
      onClick={onClick}
      onKeyDown={onKeyDown}
      onPointerDownCapture={onPointerDownCapture}
      listeners={listeners}
      attributes={attributes}
    />
  );
};

export default InteractiveAccountItem;
