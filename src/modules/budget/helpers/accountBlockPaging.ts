import {
  ACCOUNT_BLOCK_MOBILE_COLUMNS,
  ACCOUNT_CARD_MIN_WIDTH_PX,
  ACCOUNT_GRID_GAP_PX,
  ACCOUNT_GRID_ROW_GAP_PX,
} from '@/modules/budget/constants.ts';

type PageCursor = {
  page: number;
  totalPages: number;
};

const atLeastOne = (value: number): number => Math.max(1, value);

export const pageCount = (itemCount: number, pageSize: number): number => {
  if (itemCount <= 0) {
    return 1;
  }

  return Math.ceil(itemCount / atLeastOne(pageSize));
};

export const clampPageIndex = (page: number, totalPages: number): number => {
  const last = atLeastOne(totalPages) - 1;

  if (page < 0) {
    return 0;
  }

  if (page > last) {
    return last;
  }

  return page;
};

export const slicePage = <T>(
  items: T[],
  pageIndex: number,
  pageSize: number,
): T[] => {
  const size = atLeastOne(pageSize);
  const page = clampPageIndex(pageIndex, pageCount(items.length, size));

  return items.slice(page * size, page * size + size);
};

export const columnCount = ({
  isDesktop,
  containerWidth,
  minCardWidth = ACCOUNT_CARD_MIN_WIDTH_PX,
  gap = ACCOUNT_GRID_GAP_PX,
}: {
  isDesktop: boolean;
  containerWidth: number;
  minCardWidth?: number;
  gap?: number;
}): number => {
  if (!isDesktop || containerWidth <= 0) {
    return ACCOUNT_BLOCK_MOBILE_COLUMNS;
  }

  return atLeastOne(Math.floor((containerWidth + gap) / (minCardWidth + gap)));
};

export const rowCount = ({
  availableHeight,
  minCardHeight,
  gap = ACCOUNT_GRID_ROW_GAP_PX,
}: {
  availableHeight: number;
  minCardHeight: number;
  gap?: number;
}): number => {
  if (availableHeight <= 0) {
    return 1;
  }

  return atLeastOne(
    Math.floor((availableHeight + gap) / (minCardHeight + gap)),
  );
};

export const nextPageIndex = ({ page, totalPages }: PageCursor): number => {
  const current = clampPageIndex(page, totalPages);

  return current >= atLeastOne(totalPages) - 1 ? 0 : current + 1;
};

export const prevPageIndex = ({ page, totalPages }: PageCursor): number => {
  const current = clampPageIndex(page, totalPages);
  const last = atLeastOne(totalPages) - 1;

  return current <= 0 ? last : current - 1;
};
