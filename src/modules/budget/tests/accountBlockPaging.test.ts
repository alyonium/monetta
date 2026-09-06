import { describe, expect, it } from 'vitest';
import { ACCOUNT_BLOCK_MOBILE_COLUMNS } from '@/modules/budget/constants.ts';
import {
  clampPageIndex,
  columnCount,
  nextPageIndex,
  pageCount,
  prevPageIndex,
  slicePage,
} from '@/modules/budget/helpers/accountBlockPaging.ts';

describe('pageCount', () => {
  it('counts one page when there is only Add', () => {
    expect(pageCount(1, 4)).toBe(1);
  });

  it('fits three accounts plus Add on one page of four', () => {
    expect(pageCount(4, 4)).toBe(1);
  });

  it('puts Add alone on the second page when there are four accounts', () => {
    expect(pageCount(5, 4)).toBe(2);
  });

  it('clamps a page size below 1', () => {
    expect(pageCount(5, 0)).toBe(5);
    expect(pageCount(5, -2)).toBe(5);
  });
});

describe('slicePage', () => {
  it('returns the first page of four including Add', () => {
    expect(slicePage(['a', 'b', 'c', 'add'], 0, 4)).toEqual([
      'a',
      'b',
      'c',
      'add',
    ]);
  });

  it('returns only Add on the last page of four accounts plus Add', () => {
    expect(slicePage(['a', 'b', 'c', 'd', 'add'], 1, 4)).toEqual(['add']);
  });

  it('returns the last page when the index is past the end', () => {
    expect(slicePage(['a', 'b', 'c', 'd', 'add'], 9, 4)).toEqual(['add']);
  });
});

describe('columnCount', () => {
  it('always uses four columns on mobile', () => {
    expect(columnCount({ isDesktop: false, containerWidth: 1200 })).toBe(
      ACCOUNT_BLOCK_MOBILE_COLUMNS,
    );
  });

  it('uses four columns until the desktop viewport is measured', () => {
    expect(columnCount({ isDesktop: true, containerWidth: 0 })).toBe(
      ACCOUNT_BLOCK_MOBILE_COLUMNS,
    );
  });

  it('fits two columns at 200px and ten at 890px on desktop', () => {
    expect(columnCount({ isDesktop: true, containerWidth: 200 })).toBe(2);
    expect(columnCount({ isDesktop: true, containerWidth: 890 })).toBe(10);
  });

  it('does not return zero columns for a narrow desktop container', () => {
    expect(columnCount({ isDesktop: true, containerWidth: 1 })).toBe(1);
  });
});

describe('page index', () => {
  it('wraps next from the last page to the first', () => {
    expect(nextPageIndex({ page: 1, totalPages: 2 })).toBe(0);
    expect(nextPageIndex({ page: 0, totalPages: 3 })).toBe(1);
  });

  it('wraps previous from the first page to the last', () => {
    expect(prevPageIndex({ page: 0, totalPages: 3 })).toBe(2);
    expect(prevPageIndex({ page: 2, totalPages: 3 })).toBe(1);
    expect(prevPageIndex({ page: 0, totalPages: 1 })).toBe(0);
  });

  it('clamps after the page size changes', () => {
    expect(clampPageIndex(4, 2)).toBe(1);
    expect(clampPageIndex(-1, 3)).toBe(0);
  });
});
