import { Text, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import HistoryTransactionList from '@/modules/history/components/HistoryTransactionList/HistoryTransactionList.tsx';
import { useHistoryList } from '@/modules/history/hooks/useHistoryList.ts';
import styles from './History.module.css';

const History = () => {
  const { t } = useTranslation();

  const {
    groups,
    loadNextPage,
    loadingNextPage,
    nextPageFailed,
    scrollRoot,
    search,
    setSearch,
    showList,
    statusLabel,
  } = useHistoryList();

  return (
    <div className={styles.page}>
      <TextInput
        aria-label={t('history.search')}
        className={styles.search}
        rightSection={
          <MagnifyingGlassIcon
            aria-hidden
            color='var(--mantine-color-dimmed)'
            size={16}
          />
        }
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />

      <div className={styles.list} onScroll={loadNextPage} ref={scrollRoot}>
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
    </div>
  );
};

export default History;
