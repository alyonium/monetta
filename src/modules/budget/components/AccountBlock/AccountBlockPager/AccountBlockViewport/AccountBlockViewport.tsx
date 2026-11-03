import {
  type Ref,
  type RefCallback,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { useDndContext } from '@dnd-kit/core';
import { clsx } from 'clsx';
import AccountPageGrid from '@/modules/budget/components/AccountBlock/AccountPageGrid/AccountPageGrid.tsx';
import {
  nextPageIndex,
  prevPageIndex,
  slicePage,
} from '@/modules/budget/helpers/layout/accountBlockPaging.ts';
import {
  dragComesFrom,
  previewAccountPage,
} from '@/modules/budget/helpers/layout/previewAccountPage.ts';
import { useAccountDragPageEdge } from '@/modules/budget/hooks/useAccountDragPageEdge.ts';
import { usePageSwipe } from '@/modules/budget/hooks/usePageSwipe.ts';
import type { AccountBlockViewportHandle } from '@/modules/budget/types/accountBlockViewportHandle.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountBlockViewport.module.css';

type AccountBlockViewportProps = {
  carouselRef: Ref<AccountBlockViewportHandle>;
  sizeRef: RefCallback<HTMLDivElement | null>;
  items: AccountPageItem[];
  columns: number;
  pageSize: number;
  totalPages: number;
  minHeight: string;
  fillHeight: boolean;
  pageIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onJump: (index: number) => void;
  onAddAccount: () => void;
  onSelectAccount: (account: BudgetAccount) => void;
  editing: boolean;
  overAccount: BudgetAccount | null;
};

const AccountBlockViewport = ({
  carouselRef,
  sizeRef,
  items,
  columns,
  pageSize,
  totalPages,
  minHeight,
  fillHeight,
  pageIndex,
  onNext,
  onPrev,
  onJump,
  onAddAccount,
  onSelectAccount,
  editing,
  overAccount,
}: AccountBlockViewportProps) => {
  const { active } = useDndContext();
  const boundaryRef = useRef<HTMLDivElement | null>(null);
  const setBoundaryRef = useCallback(
    (node: HTMLDivElement | null) => {
      boundaryRef.current = node;
      sizeRef(node);
    },
    [sizeRef],
  );
  const canLoop = totalPages > 1;
  const draggedHere =
    editing &&
    active != null &&
    items.some(
      (item) => item.type === 'account' && item.account.id === active.id,
    );
  const activeId = draggedHere && active ? String(active.id) : null;
  const overId = activeId && overAccount ? overAccount.id : null;
  const previousPage = prevPageIndex({ page: pageIndex, totalPages });
  const nextPage = nextPageIndex({ page: pageIndex, totalPages });

  const {
    trackRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
    slideNext,
    slidePrev,
  } = usePageSwipe({
    onNext,
    onPrev,
    canLoop,
    pageIndex,
    enabled: !active,
  });

  useAccountDragPageEdge({
    enabled: draggedHere && canLoop,
    boundaryRef,
    onPrev,
    onNext,
  });

  useImperativeHandle(carouselRef, () => ({
    slideNext,
    slidePrev,
    selectPage: (index: number) => {
      if (index === pageIndex) {
        return;
      }

      if (index === nextPage) {
        slideNext();
        return;
      }

      if (index === previousPage) {
        slidePrev();
        return;
      }

      onJump(index);
    },
  }));

  const pageGrid = (page: number, interactive: boolean) => {
    const pageItems = slicePage(items, page, pageSize);
    const preview =
      interactive && activeId && overId
        ? previewAccountPage(items, page, pageSize, activeId, overId)
        : null;
    return (
      <AccountPageGrid
        items={pageItems}
        columns={columns}
        minHeight={minHeight}
        onAddAccount={onAddAccount}
        onSelectAccount={onSelectAccount}
        interactive={interactive}
        editing={editing}
        preview={preview}
        activeId={activeId}
        pulledFrom={
          preview && activeId
            ? dragComesFrom(items, page, pageSize, activeId)
            : null
        }
      />
    );
  };

  return (
    <div
      ref={setBoundaryRef}
      className={clsx(styles.viewport, fillHeight && styles.fillHeight)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
    >
      <div ref={trackRef} className={styles.track}>
        <div className={styles.slide} aria-hidden inert>
          {canLoop && pageGrid(previousPage, false)}
        </div>

        <div className={styles.slide}>{pageGrid(pageIndex, true)}</div>

        <div className={styles.slide} aria-hidden inert>
          {canLoop && pageGrid(nextPage, false)}
        </div>
      </div>
    </div>
  );
};

export default AccountBlockViewport;
