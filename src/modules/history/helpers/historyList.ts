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
  const waitingForPages = hasNextPage && !nextPageFailed;
  const showList =
    hasPages && !waitingForPages && (matchCount > 0 || nextPageFailed);

  return {
    showList,
    keepPaging: hasPages && waitingForPages,
    statusKey: waitingForPages
      ? 'history.loading'
      : historyStatusKey(hasPages, isLoading, isError),
  };
};
