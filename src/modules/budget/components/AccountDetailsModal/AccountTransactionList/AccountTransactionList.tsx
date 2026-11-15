import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AccountTransactionCard from '@/modules/budget/components/AccountDetailsModal/AccountTransactionCard/AccountTransactionCard.tsx';
import { ACCOUNT_TRANSACTIONS_STATUS } from '@/modules/budget/constants/transactions.ts';
import { AccountTransactionsStatus } from '@/modules/budget/helpers/transactions/accountTransactionsStatus.ts';
import { EditableAccountTransaction } from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import { AccountTransactionGroup } from '@/modules/budget/types/accountTransaction.ts';
import { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountTransactionList.module.css';

type AccountTransactionListProps = {
  account: Pick<BudgetAccount, 'id' | 'name'>;
  groups: AccountTransactionGroup[];
  status: AccountTransactionsStatus;
  onTransactionClick: (transaction: EditableAccountTransaction) => void;
};

const AccountTransactionList = ({
  account,
  groups,
  status,
  onTransactionClick,
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

              {group.items.map((item, index) => (
                <AccountTransactionCard
                  key={item.journalId ?? `${item.id}:${index}`}
                  account={account}
                  transaction={item}
                  onSelect={onTransactionClick}
                />
              ))}
            </section>
          ))}
        </div>
      );
  }
};

export default AccountTransactionList;
