import { useState } from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AccountDetailsHeader from '@/modules/budget/components/AccountDetailsModal/AccountDetailsHeader/AccountDetailsHeader.tsx';
import AccountTransactionList from '@/modules/budget/components/AccountDetailsModal/AccountTransactionList/AccountTransactionList.tsx';
import { accountTransactionsStatus } from '@/modules/budget/helpers/accountTransactionsStatus.ts';
import { filterAccountTransactions } from '@/modules/budget/helpers/filterAccountTransactions.ts';
import { groupAccountTransactions } from '@/modules/budget/helpers/groupAccountTransactions.ts';
import { useAccountTransactions } from '@/modules/budget/hooks/useAccountTransactions.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountDetailsBody.module.css';

type AccountDetailsBodyProps = {
  account: BudgetAccount;
  opened: boolean;
};

const AccountDetailsBody = ({ account, opened }: AccountDetailsBodyProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useAccountTransactions(
    account.id,
    opened,
  );

  const groups = groupAccountTransactions(
    filterAccountTransactions(data ?? [], search),
  );

  const status = accountTransactionsStatus(
    { data, isLoading, isError },
    groups.length > 0,
  );

  return (
    <div className={styles.body}>
      <AccountDetailsHeader account={account} />

      <TextInput
        label={t('budget.accountDetails.search')}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />

      <div className={styles.transactions}>
        <AccountTransactionList
          account={account}
          groups={groups}
          status={status}
        />
      </div>

      <Group justify='space-between'>
        <Button type='button' color='red' variant='light'>
          {t('budget.accountDetails.delete')}
        </Button>

        <Button type='button' variant='default'>
          {t('budget.accountDetails.hide')}
        </Button>
      </Group>
    </div>
  );
};

export default AccountDetailsBody;
