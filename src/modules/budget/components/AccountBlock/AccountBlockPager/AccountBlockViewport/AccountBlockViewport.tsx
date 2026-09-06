import { type Ref, useImperativeHandle } from 'react';
import AccountPageGrid from '@/modules/budget/components/AccountBlock/AccountPageGrid/AccountPageGrid.tsx';
import {
  nextPageIndex,
  pageCount,
  prevPageIndex,
  slicePage,
} from '@/modules/budget/helpers/accountBlockPaging.ts';
import type { AccountBlockViewportHandle } from '@/modules/budget/types/accountBlockViewportHandle.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import styles from './AccountBlockViewport.module.css';
import { usePageSwipe } from './usePageSwipe.ts';

type AccountBlockViewportProps = {
  carouselRef: Ref<AccountBlockViewportHandle>;
  sizeRef: Ref<HTMLDivElement>;
  items: AccountPageItem[];
  columns: number;
  pageIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onJump: (index: number) => void;
};

const AccountBlockViewport = ({
  carouselRef,
  sizeRef,
  items,
  columns,
  pageIndex,
  onNext,
  onPrev,
  onJump,
}: AccountBlockViewportProps) => {
  const totalPages = pageCount(items.length, columns);
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

  return (
    <div
      ref={sizeRef}
      className={styles.viewport}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
    >
      <div ref={trackRef} className={styles.track}>
        <div className={styles.slide} aria-hidden inert>
          {canLoop && (
            <AccountPageGrid
              items={slicePage(items, previousPage, columns)}
              columns={columns}
            />
          )}
        </div>

        <div className={styles.slide}>
          <AccountPageGrid
            items={slicePage(items, pageIndex, columns)}
            columns={columns}
          />
        </div>

        <div className={styles.slide} aria-hidden inert>
          {canLoop && (
            <AccountPageGrid
              items={slicePage(items, nextPage, columns)}
              columns={columns}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountBlockViewport;
