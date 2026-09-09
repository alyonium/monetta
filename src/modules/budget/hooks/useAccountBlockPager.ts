import { useState } from 'react';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import {
  ACCOUNT_BLOCK_DESKTOP_MIN_PX,
  ACCOUNT_GRID_ROW_GAP_PX,
} from '@/modules/budget/constants.ts';
import {
  clampPageIndex,
  columnCount,
  nextPageIndex,
  pageCount,
  prevPageIndex,
  rowCount,
} from '@/modules/budget/helpers/accountBlockPaging.ts';
import { toAccountPageItems } from '@/modules/budget/helpers/toAccountPageItems.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

const desktopQuery = `(min-width: ${ACCOUNT_BLOCK_DESKTOP_MIN_PX}px)`;

type UseAccountBlockPagerArgs = {
  accounts: BudgetAccount[];
  fillHeight: boolean;
  minCardHeightPx: number;
};

export const useAccountBlockPager = ({
  accounts,
  fillHeight,
  minCardHeightPx,
}: UseAccountBlockPagerArgs) => {
  const isDesktop = useMediaQuery(desktopQuery, false, {
    getInitialValueInEffect: false,
  });
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const [pageIndex, setPageIndex] = useState(0);

  const columns = columnCount({ isDesktop, containerWidth: width });
  const rows = fillHeight
    ? rowCount({
        availableHeight: height,
        minCardHeight: minCardHeightPx,
        gap: ACCOUNT_GRID_ROW_GAP_PX,
      })
    : 1;
  const pageSize = columns * rows;
  const items = toAccountPageItems(accounts);
  const totalPages = pageCount(items.length, pageSize);
  const currentPage = clampPageIndex(pageIndex, totalPages);

  return {
    viewportRef: ref,
    items,
    columns,
    pageSize,
    currentPage,
    totalPages,
    showArrows: isDesktop && totalPages > 1,
    goNext: () =>
      setPageIndex(nextPageIndex({ page: currentPage, totalPages })),
    goPrev: () =>
      setPageIndex(prevPageIndex({ page: currentPage, totalPages })),
    goToPage: (index: number) => setPageIndex(clampPageIndex(index, totalPages)),
  };
};
