import { useState } from 'react';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import { toAccountPageItems } from '@/modules/budget/components/AccountBlock/accountPageItem.ts';
import { ACCOUNT_BLOCK_DESKTOP_MIN_PX } from '@/modules/budget/constants.ts';
import {
  clampPageIndex,
  columnCount,
  nextPageIndex,
  pageCount,
  prevPageIndex,
} from '@/modules/budget/helpers/accountBlockPaging.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

const desktopQuery = `(min-width: ${ACCOUNT_BLOCK_DESKTOP_MIN_PX}px)`;

export const useAccountBlockPager = (accounts: BudgetAccount[]) => {
  const isDesktop = useMediaQuery(desktopQuery, false, {
    getInitialValueInEffect: false,
  });
  const { ref, width } = useElementSize<HTMLDivElement>();
  const [pageIndex, setPageIndex] = useState(0);

  const columns = columnCount({ isDesktop, containerWidth: width });
  const items = toAccountPageItems(accounts);
  const totalPages = pageCount(items.length, columns);
  const currentPage = clampPageIndex(pageIndex, totalPages);

  return {
    viewportRef: ref,
    items,
    columns,
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
