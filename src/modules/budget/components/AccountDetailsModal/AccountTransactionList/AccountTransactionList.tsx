import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AccountTransactionCard from '@/modules/budget/components/AccountDetailsModal/AccountTransactionCard/AccountTransactionCard.tsx';
import { ACCOUNT_TRANSACTIONS_STATUS } from '@/modules/budget/constants.ts';
import type { AccountTransactionsStatus } from '@/modules/budget/helpers/accountTransactionsStatus.ts';
import type { AccountTransactionGroup } from '@/modules/budget/types/accountTransaction.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountTransactionList.module.css';

type AccountTransactionListProps = {
  account: Pick<BudgetAccount, 'id' | 'name'>;
  groups: AccountTransactionGroup[];
  status: AccountTransactionsStatus;
};

const AccountTransactionList = ({
  account,
  groups,
  status,
}: AccountTransactionListProps) => {
  const { t } = useTranslation();

  switch (status) {
    case ACCOUNT_TRANSACTIONS_STATUS.LOADING:
      return (
        <Text c='dimmed' className={styles.status} size='sm'>
          {t('budget.accountDetails.loading')}
        </Text>
      );
    case ACCOUNT_TRANSACTIONS_STATUS.ERROR:
      return (
        <Text c='dimmed' className={styles.status} size='sm'>
          {t('budget.accountDetails.loadFailed')}
        </Text>
      );
    case ACCOUNT_TRANSACTIONS_STATUS.EMPTY:
      return (
        <Text c='dimmed' className={styles.status} size='sm'>
          {t('budget.accountDetails.noTransactions')}
        </Text>
      );
    case ACCOUNT_TRANSACTIONS_STATUS.READY:
      return (
        <div className={styles.groups}>
          {groups.map((group) => (
            <section className={styles.group} key={group.date}>
              <Text className={styles.date} fw={600} size='sm'>
                {group.label}
              </Text>

              {group.items.map((item) => (
                <AccountTransactionCard
                  key={item.journalId}
                  account={account}
                  transaction={item}
                />
              ))}
            </section>
          ))}
        </div>
      );
  }
};

export default AccountTransactionList;
