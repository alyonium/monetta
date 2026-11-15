import { Loader, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AccountTransactionGroup } from '@/modules/budget/types/accountTransaction.ts';
import HistoryTransactionCard from '@/modules/history/components/HistoryTransactionCard/HistoryTransactionCard.tsx';
import styles from './HistoryTransactionList.module.css';

type HistoryTransactionListProps = {
  groups: AccountTransactionGroup[];
  loadingNextPage: boolean;
  nextPageFailed: boolean;
};

const HistoryTransactionList = ({
  groups,
  loadingNextPage,
  nextPageFailed,
}: HistoryTransactionListProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section className={styles.group} key={group.date}>
          <Text className={styles.date} fw={600} size='sm'>
            {group.label}
          </Text>

          {group.items.map((item, index) => (
            <HistoryTransactionCard
              key={item.journalId ?? `${item.id}:${index}`}
              transaction={item}
            />
          ))}
        </section>
      ))}

      {loadingNextPage && (
        <div className={styles.loader}>
          <Loader
            aria-label={t('history.loading')}
            color='indigo.4'
            size='sm'
          />
        </div>
      )}

      {nextPageFailed && (
        <Text c='dimmed' size='sm'>
          {t('history.loadFailed')}
        </Text>
      )}
    </div>
  );
};

export default HistoryTransactionList;
