import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountBlock from '@/modules/budget/components/AccountBlock/AccountBlock.tsx';
import AccountDetailsModal from '@/modules/budget/components/AccountDetailsModal/AccountDetailsModal.tsx';
import CreateAccountModal from '@/modules/budget/components/CreateAccountModal/CreateAccountModal.tsx';
import ParametersBar from '@/modules/budget/components/ParametersBar/ParametersBar.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/budgetMonth.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';
import { useBudgetMonthTotals } from '@/modules/budget/hooks/useBudgetMonthTotals.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';
import type {
  AccountDetailsSession,
  CreateAccountSession,
} from '@/modules/budget/types/budgetSession.ts';
import styles from './Budget.module.css';

const Budget = () => {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => startOfMonth(todayIso()));
  const [create, setCreate] = useState<CreateAccountSession>({
    opened: false,
    type: ACCOUNT_TYPE.INCOME,
    id: 0,
  });
  const [details, setDetails] = useState<AccountDetailsSession>({
    opened: false,
    account: null,
  });
  const { data, isError } = useBudgetAccounts(month);
  const totals = useBudgetMonthTotals(month, data?.[ACCOUNT_TYPE.CURRENT]);

  const onAddAccount = (type: AccountType) => {
    setCreate((current) => ({
      opened: true,
      type,
      id: current.id + 1,
    }));
  };

  return (
    <div className={styles.page}>
      <ParametersBar month={month} onMonthChange={setMonth} totals={totals} />

      {data ? (
        Object.values(ACCOUNT_TYPE).map((type) => (
          <AccountBlock
            key={type}
            type={type}
            accounts={data[type]}
            onAddAccount={() => onAddAccount(type)}
            onSelectAccount={(account) => setDetails({ opened: true, account })}
          />
        ))
      ) : (
        <p className={styles.status}>
          {isError ? t('budget.errors.loadFailed') : t('budget.loading')}
        </p>
      )}

      <CreateAccountModal
        key={create.id}
        opened={create.opened}
        onClose={() => setCreate((current) => ({ ...current, opened: false }))}
        accountType={create.type}
        orderedIds={data?.[create.type].map((account) => account.id) ?? []}
        month={month}
      />

      <AccountDetailsModal
        opened={details.opened}
        onClose={() =>
          setDetails((current) => ({ ...current, opened: false }))
        }
        account={details.account}
      />
    </div>
  );
};

export default Budget;
