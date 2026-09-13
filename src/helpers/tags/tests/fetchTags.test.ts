import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listTag } from '@/api/sdk.gen.ts';
import {
  TAGS_MISSING_ERROR,
  TAGS_PAGE_LIMIT,
} from '@/helpers/tags/constants.ts';
import { fetchTags } from '@/helpers/tags/fetchTags.ts';
import {
  createFireflyTag,
  createRequest,
  createTagPageResult,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listTag: vi.fn(),
}));

const listTagMock = vi.mocked(listTag);

describe('fetchTags', () => {
  beforeEach(() => {
    listTagMock.mockReset();
  });

  it('maps tags and requests the catalog page limit', async () => {
    listTagMock.mockResolvedValue(
      createTagPageResult(
        [
          createFireflyTag('1', 'Groceries'),
          createFireflyTag('2', 'Salary'),
          createFireflyTag('3', 'rent'),
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const tags = await fetchTags();

    expect(listTagMock).toHaveBeenCalledWith({
      query: { page: 1, limit: TAGS_PAGE_LIMIT },
    });
    expect(tags).toEqual(['Groceries', 'Salary', 'rent']);
  });

  it('skips empty tags and keeps the first lowercase duplicate', async () => {
    listTagMock.mockResolvedValue(
      createTagPageResult(
        [
          createFireflyTag('1', 'Groceries'),
          createFireflyTag('2', '  '),
          createFireflyTag('3', 'groceries'),
          createFireflyTag('4', ' GROCERIES '),
          createFireflyTag('5', 'Bills'),
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const tags = await fetchTags();

    expect(tags).toEqual(['Groceries', 'Bills']);
  });

  it('throws when data is missing', async () => {
    listTagMock.mockResolvedValue({
      data: undefined,
      error: { message: 'Unauthenticated' },
      request: createRequest(),
      response: new Response(null, { status: 401 }),
    });

    let missingDataError: Error | undefined;

    try {
      await fetchTags();
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(TAGS_MISSING_ERROR));
  });
});
