const HISTORY_LIST_BOTTOM_DISTANCE = 1;

export const isHistoryListAtBottom = (root: HTMLElement): boolean =>
  root.scrollHeight - root.scrollTop - root.clientHeight <=
  HISTORY_LIST_BOTTOM_DISTANCE;

type HistoryStatusKey =
  'history.loading' | 'history.loadFailed' | 'history.empty';

export const historyStatusKey = (
  hasPages: boolean,
  isLoading: boolean,
  isError: boolean,
): HistoryStatusKey => {
  if (!hasPages && isLoading) {
    return 'history.loading';
  }

  if (!hasPages && isError) {
    return 'history.loadFailed';
  }

  return 'history.empty';
};

type HistoryListViewInput = {
  hasPages: boolean;
  isLoading: boolean;
  isError: boolean;
  matchCount: number;
  hasNextPage: boolean;
  nextPageFailed: boolean;
};

export type HistoryListView = {
  showList: boolean;
  keepPaging: boolean;
  statusKey: HistoryStatusKey;
};

export const historyListView = ({
  hasPages,
  isLoading,
  isError,
  matchCount,
  hasNextPage,
  nextPageFailed,
}: HistoryListViewInput): HistoryListView => {
  const showList =
    hasPages && (matchCount > 0 || hasNextPage || nextPageFailed);

  return {
    showList,
    keepPaging: hasPages && matchCount === 0 && hasNextPage && !nextPageFailed,
    statusKey: historyStatusKey(hasPages, isLoading, isError),
  };
};
