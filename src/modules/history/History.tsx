import { ActionIcon, Badge, Loader, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_TRANSACTION_ORDER } from '@/modules/budget/helpers/transactions/groupAccountTransactions.ts';
import HistoryFiltersModal from '@/modules/history/components/HistoryFiltersModal/HistoryFiltersModal.tsx';
import HistoryTransactionList from '@/modules/history/components/HistoryTransactionList/HistoryTransactionList.tsx';
import { useHistoryList } from '@/modules/history/hooks/useHistoryList.ts';
import styles from './History.module.css';

const History = () => {
  const { t } = useTranslation();
  const [filtersOpened, { open: openFilters, close: closeFilters }] =
    useDisclosure(false);

  const {
    filterCount,
    filters,
    groups,
    loadNextPage,
    loadingNextPage,
    nextPageFailed,
    order,
    pending,
    scrollRoot,
    search,
    setFilters,
    setSearch,
    showList,
    statusLabel,
    toggleOrder,
  } = useHistoryList();

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
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

        <ActionIcon
          aria-label={t('history.filters.open')}
          className={styles.toolbarButton}
          onClick={openFilters}
          radius='md'
          type='button'
          variant='default'
        >
          <FunnelIcon aria-hidden size={18} />
        </ActionIcon>

        {filterCount > 0 && <Badge>{filterCount}</Badge>}

        <ActionIcon
          aria-label={t('history.sort')}
          aria-pressed={order === ACCOUNT_TRANSACTION_ORDER.ASC}
          className={styles.toolbarButton}
          onClick={toggleOrder}
          radius='md'
          type='button'
          variant='default'
        >
          {order === ACCOUNT_TRANSACTION_ORDER.ASC ? (
            <SortAscendingIcon aria-hidden size={18} />
          ) : (
            <SortDescendingIcon aria-hidden size={18} />
          )}
        </ActionIcon>
      </div>

      <div className={styles.list} onScroll={loadNextPage} ref={scrollRoot}>
        {showList ? (
          <HistoryTransactionList
            groups={groups}
            loadingNextPage={loadingNextPage}
            nextPageFailed={nextPageFailed}
          />
        ) : pending ? (
          <div className={styles.status}>
            <Loader aria-label={statusLabel} color='indigo.4' size='sm' />
          </div>
        ) : (
          <Text c='dimmed' className={styles.status} size='sm'>
            {statusLabel}
          </Text>
        )}
      </div>

      <HistoryFiltersModal
        opened={filtersOpened}
        onClose={closeFilters}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  );
};

export default History;
