const HISTORY_LIST_BOTTOM_DISTANCE = 1;

export const isHistoryListAtBottom = (root: HTMLElement): boolean =>
  root.scrollHeight - root.scrollTop - root.clientHeight <=
  HISTORY_LIST_BOTTOM_DISTANCE;

export const historyStatusKey = (
  hasPages: boolean,
  isLoading: boolean,
  isError: boolean,
): 'history.loading' | 'history.loadFailed' | 'history.empty' => {
  if (!hasPages && isLoading) {
    return 'history.loading';
  }

  if (!hasPages && isError) {
    return 'history.loadFailed';
  }

  return 'history.empty';
};
