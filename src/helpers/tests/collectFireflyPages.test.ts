import { describe, expect, it, vi } from 'vitest';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import { createPageResult } from '@/helpers/tests/helpers.ts';

const MISSING_ERROR = 'Items are missing';

describe('collectFireflyPages', () => {
  it('concatenates items from two pages', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(
        createPageResult(['a'], { current_page: 1, total_pages: 2 }),
      )
      .mockResolvedValueOnce(
        createPageResult(['b', 'c'], { current_page: 2, total_pages: 2 }),
      );

    const items = await collectFireflyPages(fetchPage, MISSING_ERROR);

    expect(items).toEqual(['a', 'b', 'c']);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenNthCalledWith(1, 1);
    expect(fetchPage).toHaveBeenNthCalledWith(2, 2);
  });

  it('returns an empty list when data is empty', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValue(
        createPageResult([], { current_page: 1, total_pages: 1 }),
      );

    const items = await collectFireflyPages(fetchPage, MISSING_ERROR);

    expect(items).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it('throws when data is missing', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ data: undefined });

    let missingDataError: Error | undefined;

    try {
      await collectFireflyPages(fetchPage, MISSING_ERROR);
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(MISSING_ERROR));
  });
});
