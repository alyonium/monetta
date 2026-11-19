import { describe, expect, it } from 'vitest';
import { historyListView } from '@/modules/history/helpers/historyList.ts';

const view = (extra: Partial<Parameters<typeof historyListView>[0]> = {}) =>
  historyListView({
    hasPages: true,
    isLoading: false,
    isError: false,
    matchCount: 0,
    hasNextPage: false,
    nextPageFailed: false,
    ...extra,
  });

describe('historyListView', () => {
  it('keeps the first load and the first-page error as status text', () => {
    expect(view({ hasPages: false, isLoading: true }).statusKey).toBe(
      'history.loading',
    );
    expect(view({ hasPages: false, isError: true })).toEqual({
      showList: false,
      keepPaging: false,
      statusKey: 'history.loadFailed',
    });
  });

  it('shows loaded matches', () => {
    expect(view({ matchCount: 2 })).toEqual({
      showList: true,
      keepPaging: false,
      statusKey: 'history.empty',
    });
  });

  it('hides a partial page set so sort does not treat it as complete', () => {
    expect(view({ matchCount: 4, hasNextPage: true })).toEqual({
      showList: false,
      keepPaging: true,
      statusKey: 'history.loading',
    });
  });

  it('shows the empty copy when every loaded page has no match and paging is done', () => {
    expect(view()).toEqual({
      showList: false,
      keepPaging: false,
      statusKey: 'history.empty',
    });
  });

  it('keeps the list visible when the next page failed', () => {
    expect(view({ hasNextPage: true, nextPageFailed: true })).toEqual({
      showList: true,
      keepPaging: false,
      statusKey: 'history.empty',
    });
  });
});
