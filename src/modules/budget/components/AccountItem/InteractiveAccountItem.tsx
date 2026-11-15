import { CSSProperties } from 'react';
import { onEnterOrSpace } from '@/helpers/onEnterOrSpace.ts';
import { useAccountDndNode } from '@/modules/budget/hooks/useAccountDndNode.ts';
import { useClickAfterDrag } from '@/modules/budget/hooks/useClickAfterDrag.ts';
import { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
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

  return (
    <AccountItem
      account={account}
      isOver={isOver}
      isDragging={isDragging}
      cardRef={setNodeRef}
      onClick={editing ? undefined : onClick}
      onKeyDown={
        editing ? undefined : onEnterOrSpace(() => onSelectAccount(account))
      }
      onPointerDownCapture={editing ? undefined : onPointerDownCapture}
      listeners={listeners}
      attributes={attributes}
      style={style}
    />
  );
};

export default InteractiveAccountItem;
