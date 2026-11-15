import { Text } from '@mantine/core';
import HistoryTransactionList from '@/modules/history/components/HistoryTransactionList/HistoryTransactionList.tsx';
import { useHistoryList } from '@/modules/history/hooks/useHistoryList.ts';
import styles from './History.module.css';

const History = () => {
  const {
    groups,
    loadNextPage,
    loadingNextPage,
    nextPageFailed,
    scrollRoot,
    showList,
    statusLabel,
  } = useHistoryList();

  return (
    <div className={styles.page} onScroll={loadNextPage} ref={scrollRoot}>
      {showList ? (
        <HistoryTransactionList
          groups={groups}
          loadingNextPage={loadingNextPage}
          nextPageFailed={nextPageFailed}
        />
      ) : (
        <Text c='dimmed' className={styles.status} size='sm'>
          {statusLabel}
        </Text>
      )}
    </div>
  );
};

export default History;
