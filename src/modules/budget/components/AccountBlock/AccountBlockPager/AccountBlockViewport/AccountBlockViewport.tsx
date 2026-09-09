import { type Ref, useImperativeHandle } from 'react';
import { clsx } from 'clsx';
import AccountPageGrid from '@/modules/budget/components/AccountBlock/AccountPageGrid/AccountPageGrid.tsx';
import {
  nextPageIndex,
  prevPageIndex,
  slicePage,
} from '@/modules/budget/helpers/accountBlockPaging.ts';
import type { AccountBlockViewportHandle } from '@/modules/budget/types/accountBlockViewportHandle.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import styles from './AccountBlockViewport.module.css';
import { usePageSwipe } from './usePageSwipe.ts';

type GridForPageArgs = {
  items: AccountPageItem[];
  page: number;
  pageSize: number;
  columns: number;
  minHeight: string;
  onAddAccount: () => void;
};

const gridForPage = ({
  items,
  page,
  pageSize,
  columns,
  minHeight,
  onAddAccount,
}: GridForPageArgs) => (
  <AccountPageGrid
    items={slicePage(items, page, pageSize)}
    columns={columns}
    minHeight={minHeight}
    onAddAccount={onAddAccount}
  />
);

type AccountBlockViewportProps = {
  carouselRef: Ref<AccountBlockViewportHandle>;
  sizeRef: Ref<HTMLDivElement>;
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
}: AccountBlockViewportProps) => {
  const canLoop = totalPages > 1;
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

  const pageGrid = (page: number) =>
    gridForPage({ items, page, pageSize, columns, minHeight, onAddAccount });

  return (
    <div
      ref={sizeRef}
      className={clsx(styles.viewport, fillHeight && styles.fillHeight)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
    >
      <div ref={trackRef} className={styles.track}>
        <div className={styles.slide} aria-hidden inert>
          {canLoop && pageGrid(previousPage)}
        </div>

        <div className={styles.slide}>{pageGrid(pageIndex)}</div>

        <div className={styles.slide} aria-hidden inert>
          {canLoop && pageGrid(nextPage)}
        </div>
      </div>
    </div>
  );
};

export default AccountBlockViewport;
